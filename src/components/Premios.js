import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import contratoLoteria from "../abis/Loteria.json";
import winnerImages from "../imagenes/winner.png";
import {Icon} from "semantic-ui-react";

class Premios extends Component {
   
    constructor(props) {
       super(props);
       this.state = {
           contract: null,
           account: "",
           loading: false,
           errorMessage: ""
       }
    }

    async componentWillMount() {
         await this.loadWeb3();
         await this.loadBlockchainData();
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
           window.alert("No hay ningún navegador detectado. Deberías considerar usar Metamask");
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        console.log("Account: ", this.state.account);
        const networkdId = "5777";  // Ganache = 5777, Rinkeby = 4, BSC = 97
        console.log(networkdId);
        const networkData = contratoLoteria.networks[networkdId];
        console.log("NetWorkData: ", networkData);

        if (networkData) {
            const abi = contratoLoteria.abi;
            console.log("abi", abi);
            const address = networkData.address;
            console.log("address: ", address);
            const contract = new web3.eth.Contract(abi, address);
            this.setState({contract});
        } else {
            window.alert("El Smart contract no se ha desplegado en la red");
        }
    }

    render() {
        return (
            <p>Mi Premios</p>
        )
    }
}

export default Premios