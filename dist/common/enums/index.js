"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYS_Relation = exports.ON_Model = exports.SYS_Reaction = exports.SYS_PROVIDER = exports.SYS_GENDER = exports.SYS_ROLE = void 0;
var SYS_ROLE;
(function (SYS_ROLE) {
    SYS_ROLE[SYS_ROLE["user"] = 0] = "user";
    SYS_ROLE[SYS_ROLE["admin"] = 1] = "admin";
})(SYS_ROLE || (exports.SYS_ROLE = SYS_ROLE = {}));
var SYS_GENDER;
(function (SYS_GENDER) {
    SYS_GENDER[SYS_GENDER["male"] = 0] = "male";
    SYS_GENDER[SYS_GENDER["female"] = 1] = "female";
})(SYS_GENDER || (exports.SYS_GENDER = SYS_GENDER = {}));
var SYS_PROVIDER;
(function (SYS_PROVIDER) {
    SYS_PROVIDER[SYS_PROVIDER["system"] = 0] = "system";
    SYS_PROVIDER[SYS_PROVIDER["google"] = 1] = "google";
})(SYS_PROVIDER || (exports.SYS_PROVIDER = SYS_PROVIDER = {}));
var SYS_Reaction;
(function (SYS_Reaction) {
    SYS_Reaction[SYS_Reaction["like"] = 0] = "like";
    SYS_Reaction[SYS_Reaction["love"] = 1] = "love";
    SYS_Reaction[SYS_Reaction["haha"] = 2] = "haha";
    SYS_Reaction[SYS_Reaction["wow"] = 3] = "wow";
    SYS_Reaction[SYS_Reaction["sad"] = 4] = "sad";
    SYS_Reaction[SYS_Reaction["angry"] = 5] = "angry";
})(SYS_Reaction || (exports.SYS_Reaction = SYS_Reaction = {}));
var ON_Model;
(function (ON_Model) {
    ON_Model["Post"] = "Post";
    ON_Model["Comment"] = "Comment";
    ON_Model["Reel"] = "Reel";
    ON_Model["Story"] = "Story";
})(ON_Model || (exports.ON_Model = ON_Model = {}));
var SYS_Relation;
(function (SYS_Relation) {
    SYS_Relation["son"] = "son";
    SYS_Relation["brother"] = "brother";
    SYS_Relation["sister"] = "sister";
    SYS_Relation["father"] = "father";
    SYS_Relation["mother"] = "mother";
    SYS_Relation["family"] = "family";
})(SYS_Relation || (exports.SYS_Relation = SYS_Relation = {}));
