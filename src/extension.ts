'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "sl-test" is now active!');
    let channel = vscode.window.createOutputChannel('SL Test Output');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        channel.appendLine("Saying Hello World...");
        channel.show();
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.promptForInput', async () => {
        channel.appendLine("Asking for name...");
        channel.show();
        let name = await vscode.window.showInputBox({ prompt: "What is your name?" });
        channel.appendLine(`Saying hello to ${name} ...`);
        await vscode.window.showInformationMessage(`Hello ${name} :-)`);
    });
    context.subscriptions.push(disposable);

    let locationTreeItemProvider = new CountryTreeItemProvider();
    vscode.window.registerTreeDataProvider('locationTreeItemProvider', locationTreeItemProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
}


export class CountryTreeItemProvider implements vscode.TreeDataProvider<SlTreeObject> {
    private _onDidChangeTreeDataEmitter: vscode.EventEmitter<SlTreeObject | undefined> = new vscode.EventEmitter<SlTreeObject | undefined>();
    readonly onDidChangeTreeData: vscode.Event<SlTreeObject | undefined> = this._onDidChangeTreeDataEmitter.event;

    public getTreeItem(element: SlTreeObject): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element.getTreeItem();
    }
    public getChildren(element?: SlTreeObject | undefined): vscode.ProviderResult<SlTreeObject[]> {
        if (element === undefined) {
            return [
                new CountryTreeObject("Israel", ["Tel Aviv"]),
                new CountryTreeObject("England", ["London", "Reading"])
            ];
        }
        return element.getChildren();
    }
    public refresh() {
        this._onDidChangeTreeDataEmitter.fire();
    }
}


interface SlTreeObject {
    readonly id: string;
    getChildren(): vscode.ProviderResult<SlTreeObject[]>;
    getTreeItem(): vscode.TreeItem | Thenable<vscode.TreeItem>;
}

class CountryTreeObject implements SlTreeObject {
    readonly id: string;
    constructor(readonly country: string,
        readonly cityNames: string[]) {
        this.id = country;
    }
    getChildren(): vscode.ProviderResult<SlTreeObject[]> {
        return this.cityNames.map(name => new CityTreeObject(name));
    }
    getTreeItem(): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return new vscode.TreeItem(this.country, vscode.TreeItemCollapsibleState.Collapsed);
    }
}

class CityTreeObject implements SlTreeObject {
    readonly id: string;
    constructor(readonly city: string){
        this.id = city;
    }
    getChildren(): vscode.ProviderResult<SlTreeObject[]> {
        return null;
    }
    getTreeItem(): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return new vscode.TreeItem(this.city, vscode.TreeItemCollapsibleState.None);
    }
}
