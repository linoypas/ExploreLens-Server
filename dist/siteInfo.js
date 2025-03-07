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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSiteInfo = fetchSiteInfo;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default();
function fetchSiteInfo(siteName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!siteName) {
            throw new Error('Site name is required');
        }
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that provides detailed information about landmarks and famous sites.',
                    },
                    {
                        role: 'user',
                        content: `Please provide detailed information about the landmark called ${siteName}`,
                    },
                ],
            });
            console.log('Site info response:');
            return response.choices[0].message;
        }
        catch (error) {
            console.error('Error fetching site info:', error);
            throw new Error('Failed to fetch site info from GPT');
        }
    });
}
