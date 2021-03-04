const {
    app, 
    BrowserWindow, 
    Menu, 
    ipcMain} = require('electron');

let win, addWin;

// Launch app

app.on('ready', () => {
    win = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');

    //Quit app
    win.on('closed', ()=> {
        app.quit();
    })

    win.on('closed', ()=>{
        win = null
    });

    // Window menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});


app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});


function createAddItemWindow() {
    addWin = new BrowserWindow({
        width:300,
        height:200,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        title: 'Add shopping list item'
    });
    addWin.loadFile('addwindow.html');

    // handle garbage collection
    addWin.on('close', ()=>{
        addWin = null;
    });
    
}

ipcMain.on('item:add', (e,item)=> {
    console.log(item);
    win.webContents.send('item:add',item);
    //addWin.close();
});

// Menu template

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click(){
                    createAddItemWindow();
                }
            },
            {
                label: 'Clear',
                click(){
                    win.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q' ,
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// if mac
if(process.platform == 'darwin'){
    menuTemplate.unshift({});
}

// during production, add dev tools
if(process.env.NODE_ENV !== 'production'){
    menuTemplate.push({
        label: 'Developer',
        submenu:[
            {
                label: 'Toggle devtools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]

    });
}