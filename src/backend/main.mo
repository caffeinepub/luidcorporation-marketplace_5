import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  type LuidId = Text;
  type ScriptId = Nat;
  type Password = Text;

  type UserAccount = {
    luidId : LuidId;
    email : Text;
    password : Password;
  };

  let userAccounts = Map.empty<LuidId, UserAccount>();

  public query func isRegistered(luidId : LuidId) : async Bool {
    userAccounts.containsKey(luidId);
  };

  func authenticateUser(luidId : LuidId, password : Password) : Bool {
    switch (userAccounts.get(luidId)) {
      case (null) { false };
      case (?account) { account.password == password };
    };
  };

  type Category = Text;

  module Script {
    public func compare(script1 : Record, script2 : Record) : Order.Order {
      Nat.compare(script1.id, script2.id);
    };

    public type Record = {
      id : Nat;
      title : Text;
      description : Text;
      category : Category;
      price : Float;
      version : Text;
      language : Text;
      fileUrl : Text;
    };
  };

  module Purchase {
    public module Id {
      public type Record = {
        luidId : LuidId;
        scriptId : ScriptId;
      };
    };

    public type Record = {
      luidId : LuidId;
      scriptId : ScriptId;
    };
  };

  let scripts = Map.empty<ScriptId, Script.Record>();

  public type MarketplaceState = {
    var nextScriptId : ScriptId;
    purchases : List.List<Purchase.Record>;
  };

  let marketplaceState : MarketplaceState = {
    var nextScriptId = 1;
    purchases = List.empty<Purchase.Record>();
  };

  func getScriptInternal(scriptId : ScriptId) : Script.Record {
    switch (scripts.get(scriptId)) {
      case (null) { Runtime.trap("Script does not exist") };
      case (?script) { script };
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  public type UserProfile = {
    luidId : LuidId;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // User Account Management
  public shared func register(
    luidId : LuidId,
    email : Text,
    password : Text,
  ) : async () {
    if (userAccounts.containsKey(luidId)) {
      Runtime.trap("User already exists");
    };
    userAccounts.add(luidId, { luidId; email; password });
  };

  public shared func login(
    luidId : LuidId,
    password : Text,
  ) : async Bool {
    authenticateUser(luidId, password);
  };

  public type Account = {
    luidId : LuidId;
    email : Text;
    password : Password;
  };

  public query func getAllUserAccounts() : async [Account] {
    userAccounts.values().toArray();
  };

  public shared func deleteUser(luidId : LuidId) : async () {
    switch (userAccounts.get(luidId)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?_) { userAccounts.remove(luidId) };
    };
  };

  public shared func updateUser(
    luidId : LuidId,
    email : Text,
    password : Text,
  ) : async () {
    switch (userAccounts.get(luidId)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?existing) {
        let newPassword = if (Text.equal(password, "")) existing.password else password;
        userAccounts.remove(luidId);
        userAccounts.add(luidId, { luidId; email; password = newPassword });
      };
    };
  };

  // Script Management
  public shared func addScriptForSale(
    title : Text,
    description : Text,
    category : Category,
    price : Float,
    version : Text,
    language : Text,
    fileUrl : Text,
  ) : async () {
    scripts.add(
      marketplaceState.nextScriptId,
      {
        id = marketplaceState.nextScriptId;
        title;
        description;
        category;
        price;
        version;
        language;
        fileUrl;
      },
    );
    marketplaceState.nextScriptId += 1;
  };

  public shared func updateScript(
    scriptId : ScriptId,
    title : Text,
    description : Text,
    category : Category,
    price : Float,
    version : Text,
    language : Text,
    fileUrl : Text,
  ) : async () {
    ignore getScriptInternal(scriptId);
    scripts.remove(scriptId);
    scripts.add(
      scriptId,
      {
        id = scriptId;
        title;
        description;
        category;
        price;
        version;
        language;
        fileUrl;
      },
    );
  };

  public shared func deleteScript(scriptId : ScriptId) : async () {
    switch (scripts.get(scriptId)) {
      case (null) { Runtime.trap("Script does not exist") };
      case (?_) { scripts.remove(scriptId) };
    };
  };

  public query func getAllScripts() : async [Script.Record] {
    scripts.values().toArray().sort();
  };

  public query func getScriptById(scriptId : ScriptId) : async Script.Record {
    getScriptInternal(scriptId);
  };

  public query func getScriptsByCategory(category : Category) : async [Script.Record] {
    scripts.values().toArray().filter(
      func(script) { script.category == category }
    );
  };

  public query func getScriptsByLanguage(language : Text) : async [Script.Record] {
    scripts.values().toArray().filter(
      func(script) { script.language == language }
    );
  };

  // Purchase Management
  public shared func purchaseScript(
    luidId : LuidId,
    scriptId : ScriptId,
  ) : async () {
    ignore getScriptInternal(scriptId);

    if (not userAccounts.containsKey(luidId)) {
      Runtime.trap("User does not exist");
    };

    let purchase : Purchase.Record = { luidId; scriptId };

    let existingPurchases = marketplaceState.purchases.toArray();
    let anyExisting = existingPurchases.any(
      func(existing) { existing.luidId == luidId and existing.scriptId == scriptId }
    );
    if (anyExisting) {
      Runtime.trap("This script has already been purchased");
    };
    marketplaceState.purchases.add(purchase);
  };

  public query func getPurchasedScripts(luidId : LuidId) : async [ScriptId] {
    let purchasesArray = marketplaceState.purchases.toArray();
    purchasesArray.filter(
      func(purchase) { purchase.luidId == luidId }
    ).map(
      func(purchase) { purchase.scriptId }
    );
  };

  public query func hasPurchasedScript(luidId : LuidId, scriptId : ScriptId) : async Bool {
    let purchasesArray = marketplaceState.purchases.toArray();
    purchasesArray.any(
      func(purchase) {
        purchase.luidId == luidId and purchase.scriptId == scriptId;
      }
    );
  };
};
