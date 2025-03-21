// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Pedro With Me extension is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pedro-with-me.showCat', () => {
		if (currentPanel) {
			currentPanel.reveal(vscode.ViewColumn.Three);
		} else {
			currentPanel = vscode.window.createWebviewPanel(
				'pedroCat',
				'Pedro le Chat',
				vscode.ViewColumn.Three,
				{
					enableScripts: true,
					localResourceRoots: [
						vscode.Uri.file(path.join(context.extensionPath, 'resources'))
					]
				}
			);

			const resourcesUri = currentPanel.webview.asWebviewUri(
				vscode.Uri.file(path.join(context.extensionPath, 'resources'))
			);

			currentPanel.webview.html = getWebviewContent(resourcesUri.toString());
			currentPanel.onDidDispose(() => currentPanel = undefined);
		}
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent(resourcesPath: string): string {
	return `<!DOCTYPE html>
	<html>
	<head>
		<style>
			body { margin: 0; padding: 10px; background: var(--vscode-editor-background); }
			#gameCanvas {
				border: 1px solid var(--vscode-panel-border);
				border-radius: 4px;
			}
		</style>
	</head>
	<body>
		<canvas id="gameCanvas" width="300" height="200"></canvas>
		<script>
			class PedroRoom {
				constructor(canvas) {
					this.canvas = canvas;
					this.ctx = canvas.getContext('2d');
					this.animationFrame = 0;
					this.catSprite = null;
					this.loadSprite();
				}

				async loadSprite() {
					try {
						this.catSprite = await this.loadImage('${resourcesPath}/cat-sprites/cat.png');
						this.startAnimation();
					} catch (error) {
						console.error('Failed to load sprite:', error);
					}
				}

				loadImage(src) {
					return new Promise((resolve, reject) => {
						const img = new Image();
						img.onload = () => resolve(img);
						img.onerror = reject;
						img.src = src;
					});
				}

				startAnimation() {
					const animate = () => {
						this.render();
						this.animationFrame = (this.animationFrame + 1) % 60;
						requestAnimationFrame(animate);
					};
					animate();
				}

				render() {
					if (!this.ctx || !this.catSprite) return;

					this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					this.ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
					this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

					const frameWidth = 32;
					const frameHeight = 32;
					const currentFrame = Math.floor(this.animationFrame / 15) % 4;
					const x = (this.canvas.width - frameWidth) / 2;
					const y = (this.canvas.height - frameHeight) / 2;
					
					this.ctx.drawImage(
						this.catSprite,
						currentFrame * frameWidth, 0,
						frameWidth, frameHeight,
						x, y,
						frameWidth, frameHeight
					);
				}
			}

			window.onload = () => new PedroRoom(document.getElementById('gameCanvas'));
		</script>
	</body>
	</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
