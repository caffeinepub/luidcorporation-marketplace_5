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
import Storage "blob-storage/Storage";

actor {
  type LuidId = Text;
  type ScriptId = Nat;
  type Password = Text;

  module User {
    type Password = Text;
    public type Account = {
      luidId : LuidId;
      email : Text;
      password : Password;
    };

    public func compare(user1 : Account, user2 : Account) : Order.Order {
      Text.compare(user1.luidId, user2.luidId);
    };
  };

  let userAccounts = Map.empty<LuidId, User.Account>();

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
    public module Category {
      let validCategories = [
        "Discord Bots",
        "Web Scraping",
        "Automacoes",
        "Scripts de Vendas",
      ];

      public func isValid(category : Category) : Bool {
        validCategories.any(func(validCategory) { Text.equal(category, validCategory) });
      };
    };

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
    public func compare(purchase1 : Record, purchase2 : Record) : Order.Order {
      switch (Text.compare(purchase1.luidId, purchase2.luidId)) {
        case (#equal) { Nat.compare(purchase1.scriptId, purchase2.scriptId) };
        case (order) { order };
      };
    };

    public module Id {
      public type Record = {
        luidId : LuidId;
        scriptId : ScriptId;
      };

      public func compare(id1 : Record, id2 : Record) : Order.Order {
        switch (Text.compare(id1.luidId, id2.luidId)) {
          case (#equal) { Nat.compare(id1.scriptId, id2.scriptId) };
          case (order) { order };
        };
      };
    };

    public type Record = {
      luidId : LuidId;
      scriptId : ScriptId;
    };
  };

  // Marketplace state
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

  // User Profile Management
  public type UserProfile = {
    luidId : LuidId;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User Account Management
  public shared ({ caller }) func register(
    luidId : LuidId,
    email : Text,
    password : Text,
  ) : async () {
    if (userAccounts.containsKey(luidId)) {
      Runtime.trap("User already exists");
    };

    userAccounts.add(
      luidId,
      {
        luidId;
        email;
        password;
      },
    );
  };

  public shared ({ caller }) func login(
    luidId : LuidId,
    password : Text,
  ) : async Bool {
    authenticateUser(luidId, password);
  };

  public shared ({ caller }) func getAllUserAccounts() : async [User.Account] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    userAccounts.values().toArray().sort();
  };

  // Script Management (Admin Only)
  public shared ({ caller }) func addScriptForSale(
    title : Text,
    description : Text,
    category : Category,
    price : Float,
    version : Text,
    language : Text,
    fileUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create scripts");
    };

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

  public shared ({ caller }) func updateScript(
    scriptId : ScriptId,
    title : Text,
    description : Text,
    category : Category,
    price : Float,
    version : Text,
    language : Text,
    fileUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update scripts");
    };

    ignore getScriptInternal(scriptId);

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

  public shared ({ caller }) func deleteScript(scriptId : ScriptId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete scripts");
    };

    ignore getScriptInternal(scriptId);
    scripts.remove(scriptId);
  };

  // Script Browsing (Public)
  public query func getAllScripts() : async [Script.Record] {
    scripts.values().toArray().sort();
  };

  public query ({ caller }) func getScriptById(scriptId : ScriptId) : async Script.Record {
    getScriptInternal(scriptId);
  };

  public query ({ caller }) func getScriptsByCategory(category : Category) : async [Script.Record] {
    scripts.values().toArray().filter(
      func(script) {
        script.category == category;
      }
    );
  };

  public query ({ caller }) func getScriptsByLanguage(language : Text) : async [Script.Record] {
    scripts.values().toArray()
      .filter(
        func(script) {
          script.language == language;
        }
      );
  };

  // Purchase Management
  public shared ({ caller }) func purchaseScript(
    luidId : LuidId,
    scriptId : ScriptId,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase scripts");
    };

    // Verify the script exists
    ignore getScriptInternal(scriptId);

    // Verify user exists
    if (not userAccounts.containsKey(luidId)) {
      Runtime.trap("User does not exist");
    };

    let purchase : Purchase.Record = {
      luidId;
      scriptId;
    };

    let existingPurchases = marketplaceState.purchases.toArray();
    let anyExisting = existingPurchases.any(
      func(existing) { existing.luidId == luidId and existing.scriptId == scriptId }
    );
    if (anyExisting) {
      Runtime.trap("This script has already been purchased");
    };
    marketplaceState.purchases.add(purchase);
  };

  public query ({ caller }) func getPurchasedScripts(luidId : LuidId) : async [ScriptId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view purchased scripts");
    };

    let purchasesArray = marketplaceState.purchases.toArray();
    purchasesArray.filter(
      func(purchase) {
        purchase.luidId == luidId;
      }
    ).map(
      func(purchase) {
        purchase.scriptId;
      }
    );
  };

  public query ({ caller }) func hasPurchasedScript(luidId : LuidId, scriptId : ScriptId) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check purchase status");
    };

    let purchasesArray = marketplaceState.purchases.toArray();
    purchasesArray.any(
      func(purchase) {
        purchase.luidId == luidId and purchase.scriptId == scriptId;
      }
    );
  };
};
