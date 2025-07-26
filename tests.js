var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        // Fonction utilitaire pour convertir en hexadécimal
        function toHex(n) {
            return n.toString(16).toUpperCase();
        }
        var OpenAI, client, stream, toolCallBuffer, toolCallId, currentToolCall, _a, stream_1, stream_1_1, chunk, choice, delta, toolCall, args, result, e_1_1, error_1;
        var _b, e_1, _c, _d;
        var _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 15, , 16]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("openai"); })];
                case 1:
                    OpenAI = (_j.sent()).default;
                    client = new OpenAI({
                        baseURL: "http://localhost:1234/v1",
                        apiKey: "lm-studio",
                    });
                    return [4 /*yield*/, client.chat.completions.create({
                            model: "llama-3.2-8b-instruct",
                            stream: true,
                            messages: [
                                { role: "system", content: "Réponds toujours en hexadécimal." },
                                { role: "user", content: "42 ?" },
                            ],
                            tools: [
                                {
                                    type: "function",
                                    function: {
                                        name: "toHex",
                                        description: "Convertit un entier en hexadécimal",
                                        parameters: {
                                            type: "object",
                                            properties: {
                                                n: {
                                                    type: "integer",
                                                    description: "L'entier à convertir en hexadécimal"
                                                }
                                            },
                                            required: ["n"],
                                        },
                                    },
                                },
                            ],
                        })];
                case 2:
                    stream = _j.sent();
                    toolCallBuffer = "";
                    toolCallId = "";
                    currentToolCall = null;
                    console.log("🤖 Réponse du modèle :");
                    _j.label = 3;
                case 3:
                    _j.trys.push([3, 8, 9, 14]);
                    _a = true, stream_1 = __asyncValues(stream);
                    _j.label = 4;
                case 4: return [4 /*yield*/, stream_1.next()];
                case 5:
                    if (!(stream_1_1 = _j.sent(), _b = stream_1_1.done, !_b)) return [3 /*break*/, 7];
                    _d = stream_1_1.value;
                    _a = false;
                    chunk = _d;
                    choice = chunk.choices[0];
                    if (!choice)
                        return [3 /*break*/, 6];
                    delta = choice.delta;
                    // Gestion du contenu textuel normal
                    if (delta === null || delta === void 0 ? void 0 : delta.content) {
                        process.stdout.write(delta.content);
                    }
                    // Gestion des appels de fonction
                    if (delta === null || delta === void 0 ? void 0 : delta.tool_calls) {
                        toolCall = delta.tool_calls[0];
                        if (toolCall) {
                            // Nouvel appel de fonction
                            if (toolCall.id) {
                                toolCallId = toolCall.id;
                                currentToolCall = {
                                    id: toolCall.id,
                                    type: 'function',
                                    function: {
                                        name: ((_e = toolCall.function) === null || _e === void 0 ? void 0 : _e.name) || '',
                                        arguments: ((_f = toolCall.function) === null || _f === void 0 ? void 0 : _f.arguments) || ''
                                    }
                                };
                                console.log("\n\uD83D\uDD27 Appel de fonction d\u00E9tect\u00E9: ".concat((_g = toolCall.function) === null || _g === void 0 ? void 0 : _g.name));
                            }
                            // Accumulation des arguments (ils peuvent arriver en plusieurs chunks)
                            if ((_h = toolCall.function) === null || _h === void 0 ? void 0 : _h.arguments) {
                                toolCallBuffer += toolCall.function.arguments;
                                if (currentToolCall) {
                                    currentToolCall.function.arguments = toolCallBuffer;
                                }
                            }
                        }
                    }
                    // Quand le choix est terminé, traiter les appels de fonction complets
                    if (choice.finish_reason === 'tool_calls' && currentToolCall) {
                        console.log("\n\uD83D\uDCDD Arguments complets: ".concat(currentToolCall.function.arguments));
                        try {
                            args = JSON.parse(currentToolCall.function.arguments);
                            if (currentToolCall.function.name === 'toHex' && typeof args.n === 'number') {
                                result = toHex(args.n);
                                console.log("\n\u2705 R\u00E9sultat de toHex(".concat(args.n, "): ").concat(result));
                                // Dans un vrai cas d'usage, vous enverriez ce résultat de retour au modèle
                                // en créant un nouveau message avec le résultat de la fonction
                                console.log("\n\uD83D\uDCA1 Pour un chat complet, vous devriez maintenant envoyer ce r\u00E9sultat au mod\u00E8le.");
                            }
                        }
                        catch (parseError) {
                            console.error("\n\u274C Erreur lors du parsing des arguments:", parseError);
                        }
                        // Reset des buffers
                        toolCallBuffer = "";
                        currentToolCall = null;
                    }
                    _j.label = 6;
                case 6:
                    _a = true;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _j.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _j.trys.push([9, , 12, 13]);
                    if (!(!_a && !_b && (_c = stream_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _c.call(stream_1)];
                case 10:
                    _j.sent();
                    _j.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14:
                    console.log("\n\n✨ Streaming terminé !");
                    return [3 /*break*/, 16];
                case 15:
                    error_1 = _j.sent();
                    console.error("❌ Une erreur s'est produite:", error_1);
                    // Gestion spécifique des erreurs de connexion
                    if (error_1 instanceof Error) {
                        if (error_1.message.includes('ECONNREFUSED')) {
                            console.error("💡 Assurez-vous que LM Studio est lancé et qu'un modèle est chargé sur le port 1234");
                        }
                    }
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
// Gestion propre des signaux d'interruption
process.on('SIGINT', function () {
    console.log('\n👋 Arrêt du programme...');
    process.exit(0);
});
main();
