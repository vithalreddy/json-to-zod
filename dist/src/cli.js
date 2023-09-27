#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonToZod_1 = require("./jsonToZod");
const fs_1 = require("fs");
async function main() {
    let sourceArgumentIndex = process.argv.indexOf("--source");
    if (sourceArgumentIndex === -1) {
        sourceArgumentIndex = process.argv.indexOf("-s");
    }
    if (sourceArgumentIndex === -1) {
        console.error("Must supply source file with --source [filename] or -s [filename}");
        process.exit(1);
    }
    const sourceFilePath = process.argv[sourceArgumentIndex + 1];
    if (!sourceFilePath) {
        console.error(`No source path was provided after ${process.argv[sourceArgumentIndex]}`);
        process.exit(1);
    }
    const sourceFileExists = (0, fs_1.existsSync)(sourceFilePath);
    if (!sourceFileExists) {
        console.error(`${sourceFilePath} doesn't exist`);
        process.exit(1);
    }
    let sourceFileContent;
    try {
        sourceFileContent = (0, fs_1.readFileSync)(sourceFilePath, "utf-8");
    }
    catch (e) {
        console.error("Failed to read sourcefile");
        console.error(e);
        process.exit(1);
    }
    let sourceFileData;
    try {
        sourceFileData = JSON.parse(sourceFileContent);
    }
    catch (e) {
        console.error("Failed to parse sourcefile contents");
        console.error(e);
        process.exit(1);
    }
    let targetArgumentIndex = process.argv.indexOf("--target");
    if (targetArgumentIndex === -1) {
        targetArgumentIndex = process.argv.indexOf("-t");
    }
    let targetFilePath = "";
    if (targetArgumentIndex !== -1) {
        targetFilePath = process.argv[targetArgumentIndex + 1];
        if (!targetFilePath) {
            console.error(`No target path was provided after ${process.argv[targetArgumentIndex]}`);
            process.exit(1);
        }
    }
    let nameArgumentIndex = process.argv.indexOf("--name");
    if (nameArgumentIndex === -1) {
        nameArgumentIndex = process.argv.indexOf("-n");
    }
    let name = "schema";
    if (nameArgumentIndex !== -1) {
        name = process.argv[nameArgumentIndex + 1];
        if (!name) {
            console.error(`No schema name was provided after ${process.argv[nameArgumentIndex]}`);
            process.exit(1);
        }
    }
    if (targetFilePath) {
        let result;
        try {
            result = await (0, jsonToZod_1.jsonToZod)(sourceFileData, name, true);
        }
        catch (e) {
            console.error("Failed to parse sourcefile content to Zod schema");
            console.error(e);
            process.exit(1);
        }
        try {
            (0, fs_1.writeFileSync)(targetFilePath, result);
        }
        catch (e) {
            console.error(`Failed to result to ${targetFilePath}`);
            console.error(e);
            process.exit(1);
        }
    }
    else {
        let result;
        try {
            result = await (0, jsonToZod_1.jsonToZod)(sourceFileData, name);
        }
        catch (e) {
            console.error("Failed to parse sourcefile content to Zod schema");
            console.error(e);
            process.exit(1);
        }
        console.log(result);
    }
}
main().then(console.log).catch(console.error);
