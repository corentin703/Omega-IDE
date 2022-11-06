import React, {Component, RefObject} from "react";
import { Navigate } from "react-router-dom";
import "@/sass/omega.ide.sass";

import {
    LeftMenu,
    LeftMenuTitle,
    LeftMenuContent,
    LeftMenuActions,
    LeftMenuAction,
} from "./components/LeftMenu";
import {
    LeftBar,
    LeftBarTop,
    LeftBarBottom,
    LeftBarAction,
} from "./components/LeftBar";
import { BottomBar, BottomBarElement } from "./components/BottomBar";
import {
    Greeting,
    GreetingLogo,
    GreetingTitle,
    GreetingVersion,
    Help,
    HelpLine,
    HelpLeft,
    HelpRight,
    HelpKey,
} from "./components/Greeting";
import {
    TopBarTabs,
    TopBarMore,
    TopBarFileName,
    TopBarTab,
    TopBar,
} from "./components/TopBar";
import {
    PopUp,
    PopUpContent,
    PopUpButtons,
    PopUpButton,
    PopUpBar,
    PopUpTitle,
    PopUpClose,
} from "./components/PopUp";
import { SimulatorScreen, SimulatorKeyboard } from "./components/Simulator";
import {
    CalculatorSearch,
    CalculatorConnected,
    CalculatorError,
    CalculatorInfoList,
    CalculatorInfo,
    CalculatorStorage,
    CalculatorFile,
} from "./components/Calculator";
import Monaco from "./components/Monaco";
import Loader from "./components/Loader";
import JSZip from "jszip";
import Numworks from "upsilon.js";
import Project from "@/ide/components/Project";
import File from "@/ide/components/File";

type UserDataType = {
    project: ProjectType;
    file: FileType;
}

type IDEEditorProps = {
    vercel: boolean;
    connector: any;
    base: string;
}

type IdeMenuType = {
    locked: boolean;
    icon: string;
    render: (shown: boolean) => JSX.Element;
};

type FileType = {
    name: string;
    content: string;
}

type ProjectType = {
    files: FileType[];
    loaded: boolean;
    name: string;
    loading: boolean;
    selected: boolean;
}

type TabType = {
    content: string;
    unsaved: boolean;
    projects: ProjectType[];
    project: ProjectType;
    file: FileType;
}

type PlatformInfoType = {
    magik: string;
    version: string;
    commit: string;
    omega: {
        version: string;
        installed: boolean;
    }
}

type RecordType = {
    name: string;
    type: string;
    code?: string;
    autoImport: boolean;
    data?: Blob;
}

type StorageType = {
    magik: string;
    records: RecordType[];
}

type CalculatorType = {
    model: string;
    storage: StorageType | null;
    platformInfo: PlatformInfoType | null;
}

type IDEEditorState = {
    connector: any;
    vercel: boolean;
    logged: null | boolean;
    tabs: TabType[];
    selected_tab: number;
    projects: ProjectType[];
    creating_file_in: any | null;
    creating_project: boolean;
    selected_left_menu: any | null;
    left_menues: {
        calculator: IdeMenuType;
        explorer: IdeMenuType;
        simulator: IdeMenuType;
        [menuName: string]: IdeMenuType;
    };
    confirm_popup_file: any | null;
    locked: boolean;
    simulator: null;
    calculator: CalculatorType | null;
    omega_theme: boolean;
}

export default class IDEEditor extends Component<IDEEditorProps, IDEEditorState> {
    private readonly calculator: any | null = null;
    private readonly simulatorRef: RefObject<HTMLIFrameElement> | undefined;

    constructor(props: IDEEditorProps) {
        super(props);
        // document.title = "Omega - IDE";

        this.state = {
            connector: props.connector.getInstance(),
            vercel: props.vercel,
            logged: null,
            tabs: [],
            selected_tab: 0,
            projects: [],
            creating_file_in: null,
            creating_project: false,
            selected_left_menu: null,
            left_menues: {
                explorer: {
                    icon: "insert_drive_file",
                    render: this.renderExplorer.bind(this),
                    locked: false,
                },
                simulator: {
                    icon: "play_arrow",
                    render: this.renderSimulator.bind(this),
                    locked: false,
                },
                calculator: {
                    icon: "usb",
                    render: this.renderCalculator.bind(this),
                    locked: false,
                },
            },
            confirm_popup_file: null,
            locked: false,
            simulator: null,
            calculator: null,
            omega_theme: false,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.onAuthStateChanged = this.onAuthStateChanged.bind(this);

        this.renderEditor = this.renderEditor.bind(this);
        this.renderGreeting = this.renderGreeting.bind(this);
        this.renderLoading = this.renderLoading.bind(this);
        this.renderLeftBar = this.renderLeftBar.bind(this);

        this.handleLeftBarClick = this.handleLeftBarClick.bind(this);
        this.handleFileClick = this.handleFileClick.bind(this);
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleMonacoChange = this.handleMonacoChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleTabClose = this.handleTabClose.bind(this);
        this.closeTab = this.closeTab.bind(this);
        this.closePopUp = this.closePopUp.bind(this);
        this.handlePopUpSave = this.handlePopUpSave.bind(this);
        this.handleFileRename = this.handleFileRename.bind(this);
        this.handleFileRemove = this.handleFileRemove.bind(this);
        this.handleFileCreate = this.handleFileCreate.bind(this);
        this.handleNewFileCancel = this.handleNewFileCancel.bind(this);
        this.handleNewFileValidate = this.handleNewFileValidate.bind(this);
        this.handleProjectRemove = this.handleProjectRemove.bind(this);
        this.handleNewProjectCancel = this.handleNewProjectCancel.bind(this);
        this.handleNewProjectValidate = this.handleNewProjectValidate.bind(
            this
        );
        this.handleCreateProject = this.handleCreateProject.bind(this);
        this.handleProjectRename = this.handleProjectRename.bind(this);
        this.handleProjectSelect = this.handleProjectSelect.bind(this);
        this.handleProjectRunSimu = this.handleProjectRunSimu.bind(this);
        this.handleProjectSendDevice = this.handleProjectSendDevice.bind(this);
        this.handleProjectZip = this.handleProjectZip.bind(this);

        this.handleSimuKeyDown = this.handleSimuKeyDown.bind(this);
        this.handleSimuKeyUp = this.handleSimuKeyUp.bind(this);
        this.handleSimuScreen = this.handleSimuScreen.bind(this);
        this.handleSimuReload = this.handleSimuReload.bind(this);

        this.handleCalculatorConnect = this.handleCalculatorConnect.bind(this);
        this.handleCalculatorConnected = this.handleCalculatorConnected.bind(
            this
        );
        this.handleCalculatorDisconnected = this.handleCalculatorDisconnected.bind(
            this
        );
        this.handleCalculatorDelete = this.handleCalculatorDelete.bind(this);
        this.handleCalculatorZipDownload = this.handleCalculatorZipDownload.bind(
            this
        );
        this.handleCalculatorSend = this.handleCalculatorSend.bind(this);

        this.toggleTheme = this.toggleTheme.bind(this);

        if (navigator.usb !== undefined) {
            this.calculator = new Numworks();
            navigator.usb.addEventListener(
                "disconnect",
                this.handleCalculatorDisconnected
            );
            this.calculator.autoConnect(this.handleCalculatorConnected);
        } else {
            this.state.left_menues.calculator.locked = true;
        }
    }

    handleCalculatorSend(project?: ProjectType) {
        if (this.state.calculator === null)
            return;

        if (this.state.calculator.storage === null)
            return;

        if (!this.state.calculator.storage.magik)
            return;

        if (project === undefined) {
            if (this.state.tabs.length === 0) return;
            const projectId = this.getProjectId(
                this.state.tabs[this.state.selected_tab].project.name
            );

            if (projectId === -1)
                return;

            project = this.state.projects[projectId];
        }

        if (!project.loaded)
            return;

        const calculator = this.state.calculator;

        project.files.forEach(file => {
            const content = file.content;
            const period = file.name.lastIndexOf(".");
            const fileName = file.name.substring(0, period);
            const fileExtension = file.name.substring(period + 1);

            const recordIdx = this.state.calculator?.storage?.records
              .findIndex(record => record.name === fileName && record.type === fileExtension);

            const newRecord: RecordType = fileExtension === "py"
              ? {
                  name: fileName,
                  type: fileExtension,
                  autoImport: true,
                  code: content,
              }
              : {
                  name: fileName,
                  type: fileExtension,
                  autoImport: false,
                  data: new Blob([content]),
                }

            if (recordIdx === undefined)
                calculator.storage.records.push(newRecord);
            else
                calculator.storage.records[recordIdx] = newRecord;
        });

        this.setState({
            calculator: calculator,
        });

        this.calculator.installStorage(calculator.storage, () => {
            //
        });
    }

    handleCalculatorDelete(userdata: any) {
        if (this.state.calculator === null)
            return;

        if (this.state.calculator.storage === null)
            return;

        if (!this.state.calculator.storage.magik)
            return;

        this.state.calculator.storage.records.splice(userdata, 1);

        this.calculator.installStorage(
            this.state.calculator.storage,
        );

        this.setState({
            calculator: this.state.calculator,
        });
    }

    async handleCalculatorZipDownload() {
        if (this.state.calculator === null)
            return;

        if (this.state.calculator.storage === null)
            return;

        if (!this.state.calculator.storage.magik)
            return;

        const zip = new JSZip();

        await Promise.all(this.state.calculator.storage.records.map(async record => {
            const name = `${record.name}${record.type !== "" ? `.${record.type}` : ""}`;
            const arrayBuffer = record.type === "py"
              ? new TextEncoder().encode(record.code).buffer as ArrayBuffer
              : await record.data?.arrayBuffer()
            ;

            if (arrayBuffer === undefined)
                return;

            zip.file(name, arrayBuffer);
        }));

        const base64 = await zip.generateAsync({ type: "base64" });

        const link = document.createElement("a");
        link.download = "storage.zip";
        link.href = `data:application/zip;base64,${base64}`;
        link.click();
    }

    async handleCalculatorConnected() {
        this.calculator.stopAutoConnect();

        const model = this.calculator.getModel(false);
        const platformInfo = await this.calculator.getPlatformInfo();

        if (!platformInfo.magik) {
            this.setState({
                calculator: {
                    model: model,
                    storage: null,
                    platformInfo: null,
                },
            });
            
            return;
        } 
          
        console.log(platformInfo);
        
        const storage = await this.calculator.backupStorage();
        this.setState({
            calculator: {
                model: model,
                storage: storage,
                platformInfo: platformInfo,
            },
        });
    }

    handleCalculatorDisconnected() {
        this.setState({
            calculator: null,
        });

        this.calculator.autoConnect(this.handleCalculatorConnected);
    }

    handleCalculatorConnect() {
        this.calculator.detect(
            this.handleCalculatorConnected,
            (error: string) => {
                console.error(error);
            }
        );
    }

    async handleProjectZip(userData: UserDataType) {
        if (this.state.locked) {
            return;
        }

        if (!this.simulatorRef) {
            return;
        }

        const projectIdx = this.getProjectId(userData);

        if (projectIdx === -1) {
            return;
        }

        const project = this.state.projects[projectIdx];
        
        if (project.loaded) {
            const zip = new JSZip();

            project.files.forEach(file => {
                zip.file(file.name, file.content);
            });

            const base64 = await zip.generateAsync({ type: "base64" });

            const link = document.createElement("a");
            link.download = `${project.name}.zip`;

            link.href = "data:application/zip;base64," + base64;
            link.click();
            
            return;
        }
        
        const projects = this.state.projects;
        projects[projectIdx].loading = true;

        this.setState({
            locked: true,
            projects: projects,
        });

        this.state.connector.loadProject(
            userData,
            (project: ProjectType) => {
                const projectId = this.getProjectId(project.name);

                if (projectId === -1) {
                    return;
                }

                const projects = this.state.projects;
                projects[projectId] = project;

                const zip = new JSZip();

                projects[projectId].files.forEach(file => {
                    zip.file(file.name, file.content);
                })

                zip.generateAsync({ type: "base64" }).then((base64) => {
                    const link = document.createElement("a");
                    link.download = projects[projectId].name + ".zip";

                    link.href = "data:application/zip;base64," + base64;
                    link.click();
                });

                this.setState({
                    projects: projects,
                    locked: false,
                });
            }
        );
    }

    handleProjectSendDevice(userData: UserDataType) {
        if (this.state.locked) {
            return;
        }

        if (!this.simulatorRef) {
            return;
        }

        const projectId = this.getProjectId(userData);

        if (projectId === -1) {
            return;
        }

        if (this.state.projects[projectId].loaded) {
            this.handleCalculatorSend(this.state.projects[projectId]);
            return;
        }

        const projects = this.state.projects;
        projects[projectId].loading = true;
        this.setState({
            locked: true,
            projects: projects,
        });

        this.state.connector.loadProject(
            userData,
            (project: ProjectType) => {
                const projectId = this.getProjectId(project.name);

                if (projectId === -1) {
                    return;
                }

                const projects = this.state.projects;

                projects[projectId] = project;

                this.handleCalculatorSend(projects[projectId]);

                this.setState({
                    projects: projects,
                    locked: false,
                });
            }
        );
    }

    async handleProjectRunSimu(userData: UserDataType) {
        if (this.state.locked) {
            return;
        }

        if (!this.simulatorRef) {
            return;
        }

        const projectId = this.getProjectId(userData);

        if (projectId === -1) {
            return;
        }

        if (this.state.projects[projectId].loaded) {
            this.simulatorRef.current?.contentWindow?.location.reload();

            const event = new CustomEvent("reload-simu", {
                detail: {scripts: this.state.projects[projectId].files},
            });

            this.simulatorRef.current?.contentWindow?.document.dispatchEvent(event);

            this.setState({
                selected_left_menu: "simulator",
            });

            return;
        }
        
        const projects = this.state.projects;
        projects[projectId].loading = true;
        this.setState({
            locked: true,
            projects: projects,
        });
        
        this.state.connector.loadProject(
          userData,
          (project: ProjectType) => {
              const projectId = this.getProjectId(project.name);

              if (projectId === -1) {
                  return;
              }

              const projects = this.state.projects;

              projects[projectId] = project;

              const event = new CustomEvent("reload-simu", {
                  detail: {scripts: projects[projectId].files},
              });

              this.simulatorRef?.current?.contentWindow?.document.dispatchEvent(
                event
              );

              this.setState({
                  projects: projects,
                  selected_left_menu: "simulator",
                  locked: false,
              });
          }
        );
    }

    handleSimuReload() {
        if (this.simulatorRef) {
            if (this.state.tabs.length === 0) return;

            const projectId = this.getProjectId(
                this.state.tabs[this.state.selected_tab].project
            );

            if (projectId === -1) return;

            const project = this.state.projects[projectId];

            if (!project.loaded) return;

            const event = new CustomEvent("reload-simu", {
                detail: { scripts: project.files },
            });

            this.simulatorRef.current?.contentWindow?.document.dispatchEvent(event);

            this.setState({
                selected_left_menu: "simulator",
            });
        }
    }

    handleSimuScreen() {
        if (this.simulatorRef) {
            const event = new CustomEvent("screenshot", { detail: {} });
            this.simulatorRef.current?.contentWindow?.document.dispatchEvent(event);
        }
    }

    handleSimuKeyDown(num: number) {
        if (this.simulatorRef) {
            const event = new CustomEvent("key-down", {
                detail: { keynum: num },
            });

            this.simulatorRef.current?.contentWindow?.document.dispatchEvent(event);
        }
    }

    handleSimuKeyUp(num: number) {
        if (!this.simulatorRef) {
            return;
        }
        
        const event = new CustomEvent("key-up", {detail: {keynum: num}});
        this.simulatorRef.current?.contentWindow?.document.dispatchEvent(event);
    }

    normalizeContent(content?: string) {
        if (content === undefined)
            return "";

        let newContent = content.replace(/\r\n/g, "\n");
        newContent = newContent.replace(/\r/g, "\n");

        if (!newContent.replace(/\s/g, "").length) {
            let comment =
                "# This comment was added automatically to allow this file to save.\n";
            comment +=
                "# You'll be able to remove it after adding text to the file.\n";
            newContent = comment + newContent;
        }

        if (!newContent.endsWith("\n")) {
            newContent += "\n";
        }

        return newContent;
    }

    onAuthStateChanged() {
        this.setState({ logged: this.state.connector.isLogged() });

        if (this.state.projects === null && this.state.connector.isLogged()) {
            this.state.connector.getProjects(
                (projects: ProjectType[]) => {
                    this.setState({
                        projects: projects,
                    });
                }
            );
        }
    }

    componentDidMount() {
        // Hide the cookies think
        const ccGrowers = document.getElementsByClassName("cookiesconsent") as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < ccGrowers.length; i++) {
            ccGrowers[i].style.display = "none";
        }

        // Hide the header and footer
        const headers = document.getElementsByClassName("header") as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < headers.length; i++) {
            headers[i].classList.add("header__hidden");
        }

        const footers = document.getElementsByClassName("footer") as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < footers.length; i++) {
            footers[i].classList.add("footer__hidden");
        }

        if (this.state.connector.isLogged()) {
            this.state.connector.getProjects(
                (projects: ProjectType[]) => {
                    this.setState({
                        projects: projects,
                        logged: true,
                    });
                }
            );
        }

        this.state.connector.onAuthStateChanged(this.onAuthStateChanged);
    }

    componentWillUnmount() {
        // Show the cookies think
        const ccRevoke = document.getElementsByClassName("cc-revoke") as HTMLCollectionOf<HTMLElement>;

        for (let i = 0; i < ccRevoke.length; i++) {
            ccRevoke[i].style.display = "flex";
        }

        const ccGrowers = document.getElementsByClassName("cc-grower") as HTMLCollectionOf<HTMLElement>;

        for (let i = 0; i < ccGrowers.length; i++) {
            ccGrowers[i].style.display = "inherit";
        }

        // Show the header and footer again
        const headers = document.getElementsByClassName("header") as HTMLCollectionOf<HTMLElement>;

        for (let i = 0; i < headers.length; i++) {
            headers[i].classList.remove("header__hidden");
        }

        const footers = document.getElementsByClassName("footer") as HTMLCollectionOf<HTMLElement>;

        for (let i = 0; i < footers.length; i++) {
            footers[i].classList.remove("footer__hidden");
        }

        this.state.connector.removeAuthStateChanged(this.onAuthStateChanged);
    }

    getFileContent(projectName: string, fileName: string) {
        const currentProject = this.state.projects
          .find(project => project.name === projectName);

        if (currentProject === undefined) {
            return null;
        }

        const currentFile = currentProject.files
          .find(file => file.name === fileName)

        if (currentFile === undefined) {
            return null;
        }

        return currentFile.content;
    }

    getFileId(projectName: string, fileName: string) {
        const currentProject = this.state.projects
          .find(project => project.name === projectName);

        if (currentProject === undefined) {
            return null;
        }

        const currentFile = currentProject.files
          .find(file => file.name === fileName);

        if (currentFile === undefined) {
            return null;
        }

        return {
            project: currentProject,
            file: currentFile,
        };
    }

    getProjectId(projectName: string): number {
        return this.state.projects
          .findIndex(project => project.name === projectName);
    }

    getTabID(project: ProjectType, file: FileType): number {
        return this.state.tabs
          .findIndex(tab => tab.project === project && tab.file === file);
    }

    handleMonacoChange(userData: UserDataType, newContent?: string) {
        const tabId = this.getTabID(userData.project, userData.file);

        if (tabId !== -1) {
            return;
        }

        const tabs = this.state.tabs;
        const tab = tabs[tabId];

        tab.content = this.normalizeContent(newContent);
        tab.unsaved = true;

        tabs[tabId] = tab;

        this.setState({
            tabs: tabs,
        });
    }

    closePopUp() {
        this.setState({
            confirm_popup_file: null,
        });
    }

    handlePopUpSave(userData: UserDataType) {
        this.handleSave();
        this.closeTab(userData);
    }

    handleSave() {
        if (this.state.locked) {
            return;
        }

        const tab = this.state.tabs[this.state.selected_tab];

        const file = this.getFileId(tab.project, tab.file);

        if (file === null) {
            return;
        }

        const projects = this.state.projects;
        file.project.loading = true;

        this.setState({
            projects: projects,
            locked: true,
        });

        const project = file.project;
        file.project.content = this.normalizeContent(
            tab.content
        );

        this.state.connector.saveProject(
            project,
            (project: ProjectType) => {
                const tabs = this.state.tabs;
                const tabId = this.state.selected_tab;
                const tab = tabs[tabId];

                const projects = this.state.projects;

                projects[file.project] = project;
                projects[file.project].loading = false;

                tab.unsaved = false;

                this.setState({
                    tabs: tabs,
                    projects: projects,
                    locked: false,
                });
            }
        );
    }

    handleFileClick(userdata: UserDataType) {
        const tabId = this.getTabID(userdata.project, userdata.file);

        if (tabId !== -1) {
            this.setState({ selected_tab: tabId });
            return;
        }

        const tabs = this.state.tabs;
        const content = this.getFileContent(userdata.project, userdata.file);

        if (content === null) {
            return;
        }

        const newTab: TabType = {
            project: userdata.project,
            projects: [
              userdata.project,
            ],
            file: userdata.file,
            content: this.normalizeContent(content),
            unsaved: false,
        };

        tabs.push(newTab);

        this.setState({
            tabs: tabs,
            selected_tab: tabs.length - 1,
        });
    }

    handleFileRename(userData: UserDataType, oldName: string, newName: string): boolean {
        if (this.state.locked) {
            return false;
        }

        const fileId = this.getFileId(userData.project.name, userData.file.name);

        if (fileId === null) {
            return false;
        }

        if (this.getFileId(userData.project.name, newName) !== null) {
            // File exists !
            return false;
        }

        const projects = this.state.projects;

        projects[fileId.project].loading = true;

        this.setState({
            projects: projects,
            locked: true,
        });

        const project = projects[fileId.project];
        project.files[fileId.file].name = newName;

        this.state.connector.saveProject(
            project,
            (project: ProjectType) => {
                const projects = this.state.projects;
                projects[fileId.project] = project;
                projects[fileId.project].loading = false;

                const tabId = this.getTabID(userData.project, userData.file);

                const tabs = this.state.tabs;

                if (tabId !== -1) {
                    tabs[tabId].file = newName;
                }

                this.setState({
                    tabs: tabs,
                    projects: projects,
                    locked: false,
                });
            }
        );

        return true;
    }

    handleFileRemove(userData: UserDataType) {
        if (this.state.locked) {
            return;
        }

        const fileId = this.getFileId(userData.project, userData.file);

        if (fileId === null) {
            return false;
        }

        const projects = this.state.projects;

        projects[fileId.project].loading = true;
        this.handleTabClose(userData, true);

        const project = JSON.parse(JSON.stringify(projects[fileId.project]));
        project.files.splice(fileId.file, 1);
        projects[fileId.project].files.splice(fileId.file, 1);

        this.setState({
            projects: projects,
            locked: true,
        });

        this.state.connector.saveProject(
            project,
            (project: ProjectType) => {
                const projects = this.state.projects;
                projects[fileId.project] = project;
                projects[fileId.project].loading = false;

                this.setState({
                    projects: projects,
                    locked: false,
                });
            }
        );
    }

    handleFileCreate(userData: UserDataType) {
        if (this.state.locked) {
            return;
        }

        if (this.state.creating_file_in !== null) return;

        const projectId = this.getProjectId(userData);

        if (projectId === -1) {
            return;
        }

        if (this.state.projects[projectId].loaded) {
            this.setState({
                creating_file_in: userData,
            });
        } else {
            const projects = this.state.projects;
            projects[projectId].loading = true;
            
            this.setState({
                locked: true,
                projects: projects,
            });
            
            this.state.connector.loadProject(
                userData,
                (project: ProjectType) => {
                    const projectId = this.getProjectId(project.name);

                    if (projectId === -1) {
                        return;
                    }

                    const projects = this.state.projects;
                    projects[projectId] = project;

                    this.setState({
                        projects: projects,
                        creating_file_in: project.name,
                        locked: false,
                    });
                }
            );
        }
    }

    handleNewFileCancel() {
        this.setState({
            creating_file_in: null,
        });
    }

    handleNewFileValidate(userData: UserDataType, oldName: string, newName: string): boolean {
        if (this.state.locked) {
            return false;
        }

        if (newName === "") {
            this.setState({
                creating_file_in: null,
            });
            return false;
        }

        const fileId = this.getFileId(userData, newName);

        if (fileId !== null) {
            // File exists
            this.setState({
                creating_file_in: null,
            });
            return false;
        }

        const projectId = this.getProjectId(userData);

        if (projectId === -1) {
            // Weird shit happens
            this.setState({
                creating_file_in: null,
            });
            return false;
        }

        const projects = this.state.projects;

        const newFile = {
            name: newName,
            content: "from math import *\n",
        };

        const project = JSON.parse(JSON.stringify(projects[projectId]));

        project.files.push(newFile);
        projects[projectId].files.push(newFile);
        projects[projectId].loading = true;

        this.setState({
            projects: projects,
            creating_file_in: null,
            locked: true,
        });

        this.state.connector.saveProject(
            project,
            (project: ProjectType) => {
                const projects = this.state.projects;
                projects[projectId] = project;
                this.setState({
                    projects: projects,
                    creating_file_in: null,
                    locked: false,
                });
            }
        );

        return true;
    }

    handleProjectRemove(userData: UserDataType) {
        if (this.state.locked) {
            return;
        }

        const projectId = this.getProjectId(userData);

        if (projectId === -1) {
            return;
        }

        const projects = this.state.projects;

        projects[projectId].loading = true;

        this.setState({
            projects: projects,
            locked: true,
        });

        this.state.connector.removeProject(
            userData,
            (name: string) => {
                const projectId = this.getProjectId(name);

                if (projectId === -1) {
                    return;
                }

                const projects = this.state.projects;

                const tabs = this.state.tabs;
                const newTabs = [];
                let selected_tab = this.state.selected_tab;

                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].project.name !== name) {
                        newTabs.push(tabs[i]);
                    } else if (this.state.selected_tab >= i) {
                        selected_tab = selected_tab > 0 ? selected_tab - 1 : 0;
                    }
                }

                projects.splice(projectId, 1);

                this.setState({
                    projects: projects,
                    tabs: newTabs,
                    selected_tab: selected_tab,
                    locked: false,
                });
            }
        );
    }

    handleCreateProject(userData: UserDataType) {
        if (this.state.locked) {
            return;
        }

        this.setState({
            creating_project: true,
        });
    }

    handleProjectRename(userData: UserDataType, newName: string) {
        if (this.state.locked) {
            return;
        }

        const projectId = this.getProjectId(userData);

        if (projectId === -1) {
            return;
        }

        const projects = this.state.projects;

        projects[projectId].loading = true;

        this.setState({
            projects: projects,
            locked: true,
        });

        this.state.connector.renameProject(
            userData,
            newName,
            (oldname: string, newname: string) => {
                const projectId = this.getProjectId(userData);

                if (projectId === -1) {
                    return;
                }

                const projects = this.state.projects;

                projects[projectId].name = newname;
                projects[projectId].loading = false;

                const tabs = this.state.tabs;

                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].project === userData) {
                        tabs[i].project = newname;
                    }
                }

                this.setState({
                    projects: projects,
                    tabs: tabs,
                    locked: false,
                });
            }
        );
    }

    handleProjectSelect(userData: UserDataType, selected: boolean) {
        const projectId = this.getProjectId(userData);

        if (projectId === -1) {
            return;
        }

        if (this.state.projects[projectId].selected) {
            const projects = this.state.projects;
            projects[projectId].selected = false;
            this.setState({
                projects: projects,
            });

            return;
        }

        if (this.state.projects[projectId].loaded) {
            const projects = this.state.projects;
            projects[projectId].selected = true;
            this.setState({
                projects: projects,
            });

            return;
        }

        if (this.state.locked) {
            return;
        }

        const projects = this.state.projects;

        projects[projectId].loading = true;

        this.setState({
            projects: projects,
            locked: true,
        });

        this.state.connector.loadProject(
          userData,
          (files: ProjectType) => {
              const projectId = this.getProjectId(files.name);

              if (projectId === -1) {
                  return;
              }

              const projects = this.state.projects;

              projects[projectId] = files;

              this.setState({
                  projects: projects,
                  locked: false,
              });
          }
        );
    }

    handleNewProjectCancel() {
        this.setState({
            creating_project: false,
        });
    }

    handleNewProjectValidate(userData: UserDataType, name: string) {
        if (this.state.locked) {
            return;
        }

        if (name === "") {
            this.setState({
                creating_project: false,
            });
            return;
        }

        const projectIdx = this.getProjectId(name);

        if (projectIdx !== -1) {
            // File exists!
            this.setState({
                creating_project: false,
            });
            return;
        }

        const projects = this.state.projects;
        projects.push({
            name: name,
            files: [],
            loading: true,
            loaded: true,
            selected: false,
        });

        this.setState({
            creating_project: false,
            locked: true,
        });

        this.state.connector.createProject(
            name,
            (project: ProjectType) => {
                const projects = this.state.projects;
                const projectIdx = this.getProjectId(project.name);

                projects[projectIdx] = project;

                this.setState({
                    projects: projects,
                    locked: false,
                });
            }
        );
    }

    closeTab(userData: UserDataType) {
        const tabIdx = this.getTabID(userData.project, userData.file);

        if (tabIdx === -1) {
            return;
        }

        const tabs = this.state.tabs;
        tabs.splice(tabIdx, 1);
        let selected_tab = this.state.selected_tab;

        if (this.state.selected_tab >= tabIdx) {
            selected_tab = selected_tab > 0 ? selected_tab - 1 : 0;
        }

        this.setState({
            selected_tab: selected_tab,
            tabs: tabs,
        });

        this.closePopUp();
    }

    handleTabClose(userData: UserDataType, force: boolean) {
        if (this.state.locked) {
            return;
        }

        const tabId = this.getTabID(userData.project, userData.file);

        if (tabId === -1) {
            return;
        }

        const tab = this.state.tabs[tabId];

        if (tab.unsaved && !force) {
            this.setState({
                confirm_popup_file: userData,
            });
        } else {
            this.closeTab(userData);
        }
    }

    handleTabClick(userData: UserDataType) {
        const tabIdx = this.getTabID(userData.project, userData.file);

        if (tabIdx !== -1) {
            this.setState({ selected_tab: tabIdx });
        }
    }

    renderCalculatorContent() {
        if (this.state.calculator === null) {
            return <CalculatorSearch onClick={this.handleCalculatorConnect} />;
        } else {
            if (this.state.calculator.platformInfo === null) {
                return <CalculatorError />;
            }

            const files = [];

            if (
                this.state.calculator.storage !== null &&
                this.state.calculator.storage.magik
            ) {
                for (
                    let i = 0;
                    i < this.state.calculator.storage.records.length;
                    i++
                ) {
                    files.push(
                        <CalculatorFile
                            key={i}
                            userdata={i}
                            onDelete={this.handleCalculatorDelete}
                            name={
                                this.state.calculator.storage.records[i].name +
                                "." +
                                this.state.calculator.storage.records[i].type
                            }
                        />
                    );
                }
            }

            return (
                <>
                    <CalculatorConnected />
                    <CalculatorInfoList>
                        <CalculatorInfo
                            name="Model"
                            value={"N" + this.state.calculator.model}
                        />
                        <CalculatorInfo
                            name="Epsilon version"
                            value={this.state.calculator.platformInfo.version}
                        />
                        <CalculatorInfo
                            name="Epsilon commit"
                            value={this.state.calculator.platformInfo.commit}
                        />
                        <CalculatorInfo
                            name="Omega version"
                            value={
                                this.state.calculator.platformInfo.omega.installed
                                    ? this.state.calculator.platformInfo.omega.version
                                    : "Not installed"
                            }
                        />
                    </CalculatorInfoList>
                    <CalculatorStorage
                        onZipDownload={this.handleCalculatorZipDownload}
                        locked={this.state.locked}
                    >
                        {files}
                    </CalculatorStorage>
                </>
            );
        }
    }

    renderCalculator(shown: boolean) {
        return (
            <LeftMenu shown={shown}>
                <LeftMenuTitle>CALCULATOR</LeftMenuTitle>
                <LeftMenuContent>
                    {this.renderCalculatorContent()}
                </LeftMenuContent>
            </LeftMenu>
        );
    }

    renderSimulator(shown: boolean) {
        return (
            <LeftMenu shown={shown}>
                <LeftMenuTitle>SIMULATOR</LeftMenuTitle>
                <LeftMenuContent>
                    <SimulatorScreen onScreen={this.handleSimuScreen}>
                        <iframe
                          title="Simulator"
                          src={`${this.props.base}simulator`}
                          ref={this.simulatorRef}
                          width="256px"
                          height="192px"
                        />
                    </SimulatorScreen>
                    <SimulatorKeyboard
                        onKeyDown={this.handleSimuKeyDown}
                        onKeyUp={this.handleSimuKeyUp}
                    />
                </LeftMenuContent>
            </LeftMenu>
        );
    }

    renderExplorer(shown: boolean) {
        const files = [];
        const content = [];

        for (let i = 0; i < this.state.projects.length; i++) {
            const project = this.state.projects[i];

            for (let j = 0; j < project.files.length; j++) {
                const file = project.files[j];

                files.push(
                    <File
                        key={i}
                        locked={this.state.locked}
                        onRemove={this.handleFileRemove}
                        onRename={this.handleFileRename}
                        onClick={this.handleFileClick}
                        name={file.name}
                        userdata={{ project: project.name, file: file.name }}
                    />
                );
            }

            let selected = project.selected;

            if (this.state.creating_file_in === project.name) {
                selected = true;
                files.push(
                    <File
                        key={i}
                        locked={this.state.locked}
                        userdata={project.name}
                        onRename={this.handleNewFileValidate}
                        onCancel={this.handleNewFileCancel}
                        name={".py"}
                        renaming={true}
                    />
                );
            }

            content.push(
                <Project
                    nousb={this.state.calculator === null}
                    locked={this.state.locked}
                    loading={project.loading}
                    onZip={this.handleProjectZip}
                    onSendDevice={this.handleProjectSendDevice}
                    onRunSimu={this.handleProjectRunSimu}
                    onSelect={(userdata) => this.handleProjectSelect(userdata, true)}
                    selected={selected}
                    onRename={this.handleProjectRename}
                    onRemove={this.handleProjectRemove}
                    onNewFile={this.handleFileCreate}
                    userdata={project.name}
                    name={project.name}
                >
                    {files}
                </Project>
            );
        }

        if (this.state.creating_project) {
            content.push(
                <Project
                    nousb={this.state.calculator === null}
                    locked={this.state.locked}
                    selected={false}
                    onRename={this.handleNewProjectValidate}
                    onCancel={this.handleNewProjectCancel}
                    renaming={true}
                    name={""}
                >
                    {files}
                </Project>
            );
        }

        return (
            <LeftMenu shown={shown}>
                <LeftMenuActions>
                    <LeftMenuAction
                        icon="create_new_folder"
                        onClick={this.handleCreateProject}
                    />
                </LeftMenuActions>
                <LeftMenuTitle>EXPLORER</LeftMenuTitle>
                <LeftMenuContent>{content}</LeftMenuContent>
            </LeftMenu>
        );
    }

    handleLeftBarClick(userData: UserDataType) {
        if (userData === this.state.selected_left_menu) {
            this.setState({
                selected_left_menu: null,
            });
        } else {
            this.setState({
                selected_left_menu: userData,
            });
        }
    }

    toggleTheme() {
        this.setState({
            omega_theme: !this.state.omega_theme,
        });
    }

    renderLeftBar() {
        const actions = [];
        const menues = [];

        for (const menuName in this.state.left_menues) {
            const leftMenu = this.state.left_menues[menuName];
            const selected = menuName === this.state.selected_left_menu;

            menues.push(leftMenu.render(selected));

            actions.push(
                <LeftBarAction
                    key={menuName}
                    onClick={this.handleLeftBarClick}
                    userdata={menuName}
                    locked={leftMenu.locked}
                    selected={selected}
                    icon={leftMenu.icon}
                />
            );
        }

        return (
            <>
                <LeftBar>
                    <LeftBarTop>{actions}</LeftBarTop>
                    <LeftBarBottom>
                        <LeftBarAction
                            img={this.state.connector.getUserPhotoURL()}
                            icon="account_circle"
                        />
                        <a href={this.props.base}>
                            <LeftBarAction icon="exit_to_app" />
                        </a>
                    </LeftBarBottom>
                </LeftBar>
                {menues}
            </>
        );
    }

    renderGreeting() {
        return (
            <Greeting>
                <GreetingLogo />
                <GreetingTitle>Omega IDE</GreetingTitle>
                <GreetingVersion>2.0.0 Alpha</GreetingVersion>
                <Help>
                    <HelpLine>
                        <HelpLeft>Create a new project</HelpLeft>
                        <HelpRight>
                            <HelpKey>Ctrl</HelpKey> + <HelpKey>N</HelpKey>
                        </HelpRight>
                    </HelpLine>
                    <HelpLine>
                        <HelpLeft>Run simulator</HelpLeft>
                        <HelpRight>
                            <HelpKey>F5</HelpKey>
                        </HelpRight>
                    </HelpLine>
                    <HelpLine>
                        <HelpLeft>Send to device</HelpLeft>
                        <HelpRight>
                            <HelpKey>F6</HelpKey>
                        </HelpRight>
                    </HelpLine>
                </Help>
            </Greeting>
        );
    }

    renderCentralPane() {
        const tabs = [];

        for (let i = 0; i < this.state.tabs.length; i++) {
            const tab = this.state.tabs[i];

            tabs.push(
                <TopBarTab
                    key={i}
                    onClose={(userData) => this.handleTabClose(userData, false)}
                    onClick={this.handleTabClick}
                    selected={this.state.selected_tab === i}
                    unsaved={tab.unsaved}
                    userdata={{ project: tab.project, file: tab.file }}
                >
                    {tab.file}
                </TopBarTab>
            );
        }

        const currentTab = this.state.tabs[this.state.selected_tab];

        return (
            <div className="editor__panel">
                {/* Top Bar */}
                <TopBar>
                    <TopBarTabs>{tabs}</TopBarTabs>
                    <TopBarMore onClick={this.handleSave} />
                    <TopBarFileName>
                        {currentTab.project} {">"} {currentTab.file}
                    </TopBarFileName>
                </TopBar>

                {/* Monaco */}
                <Monaco
                    onChange={this.handleMonacoChange}
                    value={currentTab.content}
                    userdata={{
                        project: currentTab.project,
                        file: currentTab.file,
                    }}
                />
            </div>
        );
    }

    renderConfirmPopUp() {
        return (
            <PopUp>
                <PopUpBar>
                    <PopUpTitle>You have unsaved changes</PopUpTitle>
                    <PopUpClose
                        userdata={this.state.confirm_popup_file}
                        onClick={this.closePopUp}
                    />
                </PopUpBar>
                <PopUpContent>
                    <p>
                        Do you want to save the changes you made to{" "}
                        {this.state.confirm_popup_file.file} ?
                    </p>
                    <p>{"Your changes will be lost if you don't save them."}</p>
                </PopUpContent>
                <PopUpButtons>
                    <PopUpButton
                        userdata={this.state.confirm_popup_file}
                        onClick={this.closePopUp}
                    >
                        Cancel
                    </PopUpButton>
                    <PopUpButton
                        userdata={this.state.confirm_popup_file}
                        onClick={this.closeTab}
                    >
                        {"Don't save"}
                    </PopUpButton>
                    <PopUpButton
                        userdata={this.state.confirm_popup_file}
                        onClick={this.handlePopUpSave}
                        autofocus={true}
                    >
                        Save
                    </PopUpButton>
                </PopUpButtons>
            </PopUp>
        );
    }

    renderEditor() {
        return (
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className={
                    "editor " +
                    (this.state.omega_theme ? "editor-omega-theme " : "") +
                    (this.state.locked ? " editor_locked" : "")
                }
            >
                {/* Loading */}
                <Loader hidden={true} />

                <div className="editor__panels">
                    {/* Left bar */}
                    {this.renderLeftBar()}

                    {/* Left menu */}

                    {this.state.tabs.length === 0
                        ? this.renderGreeting()
                        : this.renderCentralPane()}
                </div>

                {/* Bottom Bar */}

                <BottomBar>
                    <BottomBarElement
                        icon="play_arrow"
                        hoverable={true}
                        onClick={this.handleSimuReload}
                    >
                        Simulator
                    </BottomBarElement>
                    <BottomBarElement
                        icon="usb"
                        hoverable={true}
                        locked={this.calculator === null}
                        onClick={this.handleCalculatorSend}
                    >
                        Device
                    </BottomBarElement>
                    <BottomBarElement icon="highlight_off" hoverable={true}>
                        0
                    </BottomBarElement>
                    <BottomBarElement
                        onClick={this.toggleTheme}
                        icon="invert_colors"
                        hoverable={true}
                    >
                        Omega Theme
                    </BottomBarElement>
                    <BottomBarElement right={true}>
                        Powered by Omega{" "}
                        {this.state.vercel ? (
                            <>
                                {" "}
                                - Hosted by{" "}
                                <a
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    href="https://vercel.com/?utm_source=getomega&utm_campaign=oss"
                                >
                                    Vercel
                                </a>
                            </>
                        ) : (
                            ""
                        )}
                    </BottomBarElement>
                </BottomBar>

                {this.state.confirm_popup_file !== null
                    ? this.renderConfirmPopUp()
                    : ""}
            </div>
        );
    }

    renderLoading() {
        return (
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="editor"
            >
                <Loader />
            </div>
        );
    }

    render() {
        if (this.state.logged === true) {
            if (this.state.projects === null) {
                return this.renderLoading();
            } else {
                return this.renderEditor();
            }
        } else if (this.state.logged === false) {
            return <Navigate replace to={this.props.base} />;
        } else {
            return this.renderLoading();
        }
    }
}
