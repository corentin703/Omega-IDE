import { Component } from 'react'
import Calculator from '../etc/Calculator'

type SimulatorProps = { };

type SimulatorState = {
    loaded: boolean;
    simulator: null;
    error: boolean;
    message: string;
    scripts: null;
};

export default class Simulator extends Component<SimulatorProps, SimulatorState> {
    constructor(props: SimulatorProps) {
        super(props);

        this.state = {
            simulator: null,
            error: false,
            message: "",
            loaded: true,
            scripts: null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
    }
    
    componentDidMount() {
        const cookiesConsentElements = document.getElementsByClassName("cookiesconsent") as HTMLCollectionOf<HTMLElement>;
        const headerElements = document.getElementsByClassName("cookiesconsent") as HTMLCollectionOf<HTMLElement>;
        const footerElements = document.getElementsByClassName("cookiesconsent") as HTMLCollectionOf<HTMLElement>;

        if (cookiesConsentElements.length > 0) {
            cookiesConsentElements[0].style.display = "none";
        } 
        
        if (headerElements.length > 0) {
            headerElements[0].style.display = "none";
        }
        
        if (footerElements.length > 0) {
            footerElements[0].style.display = "none";
        }
    }

    render() {

        if (this.state.loaded) {
            if (this.state.error) {
                return (
                    <p>ERROR: {this.state.message}</p>
                );
            } else {
                return (
                    <Calculator width={"256px"} height={"192px"} python={true} scripts={this.state.scripts} keyboard={false}/>
                );
            }
        } else {
            return null;
        }
    }
}

