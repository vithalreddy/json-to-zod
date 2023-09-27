"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToZod = void 0;
const prettier_1 = require("prettier");
const jsonToZod = (obj, name = "schema", module) => {
    const parse = (obj, seen) => {
        switch (typeof obj) {
            case "string":
                return "z.string()";
            case "number":
                return "z.number()";
            case "bigint":
                return "z.number().int()";
            case "boolean":
                return "z.boolean()";
            case "object":
                if (obj === null) {
                    return "z.null()";
                }
                if (seen.find((_obj) => Object.is(_obj, obj))) {
                    throw "Circular objects are not supported";
                }
                seen.push(obj);
                if (Array.isArray(obj)) {
                    const options = obj
                        .map((obj) => parse(obj, seen))
                        .reduce((acc, curr) => acc.includes(curr) ? acc : [...acc, curr], []);
                    if (options.length === 1) {
                        return `z.array(${options[0]})`;
                    }
                    else if (options.length > 1) {
                        return `z.array(z.union([${options}]))`;
                    }
                    else {
                        return `z.array(z.unknown())`;
                    }
                }
                return `z.object({${Object.entries(obj).map(([k, v]) => `'${k}':${parse(v, seen)}`)}})`;
            case "undefined":
                return "z.undefined()";
            case "function":
                return "z.function()";
            case "symbol":
            default:
                return "z.unknown()";
        }
    };
    return module
        ? (0, prettier_1.format)(`import {z} from "zod"\n\nexport const ${name}=${parse(obj, [])}`, {
            parser: "typescript",
        })
        : (0, prettier_1.format)(`const ${name}=${parse(obj, [])}`, {
            parser: "babel",
        });
};
exports.jsonToZod = jsonToZod;
