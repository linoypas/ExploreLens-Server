"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const siteInfo_1 = require("./src/site-detection/providers/gpt/siteInfo");
function testFetchSiteInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const siteName = "Eiffel Tower"; // You can change this to any site name
            const siteInfo = yield (0, siteInfo_1.fetchSiteInfo)(siteName);
            console.log('Received site info:', siteInfo);
        }
        catch (error) {
            console.error('Error during test:', error);
        }
    });
}
testFetchSiteInfo();
