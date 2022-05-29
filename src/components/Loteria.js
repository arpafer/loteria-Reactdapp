import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import contratoLoteria from "../abis/Loteria.json";
import loteriaImages from "../imagenes/loteria.png";
import {Icon} from "semantic-ui-react";

class Loteria extends Component {
   
    constructor(props) {
       super(props);
       this.state = {
           contract: null,
           account: "",
           loading: false,
           errorMessage: "",
           numTokens: 0
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

    viewBote = async(mensaje) => {
        try {
            console.log(mensaje);
            const boteLoteria = await this.state.contract.methods.getBalanceBote().call();
            alert(parseFloat(boteLoteria));
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({loading: false});
        }
    }

    viewPriceBoleto = async(mensaje) => {
        try {
            console.log(mensaje);
            const precio = await this.state.contract.methods.ticketPrice().call();
            alert(parseFloat(precio));
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({loading: false});
        }
    }

    buyTickets = async(boletosComprados, mensaje) => {
        try {
            console.log(mensaje);
            const web3 = window.web3;
            const accounts = web3.eth.getAccounts();            
            alert("¡Mucha suerte!");
            await this.state.contract.methods.buyTicket(boletosComprados).send({from:accounts[0]});            
            
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({loading: false});
        }
    }

    // TODO: función para visualizar los números de boletos que tiene una persona.

    render() {
        return (
            <div>
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                className="navbar-brand col-sm-3 col-md-2 mr-0"
                href="https://frogames.es/rutas-de-aprendizaje"
                target="_blank"
                rel="noopener noreferrer"
                >
                DApp
                </a>
    
                <ul className="navbar-nav px-3"> 
                  <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                    <small className="text-white"><span id="account">Cuenta activa: {this.state.account}</span></small>
                  </li>
                </ul>
    
            </nav>
            <div className="container-fluid mt-5">
                <div className="row">
                <main role="main" className="col-lg-12 d-flex text-center">
                    <div className="content mr-auto ml-auto">
                      <h1>Lotería con Tokens ERC-20</h1>
                      <h2>Gestión y control de compras de boletos de lotería</h2>
                      <a href="https://www.linkedin.com/in/antonio-p-a2a1352a/" target="_blank" rel="noopener noreferrer">
                          <br />
                          <img src={loteriaImages} width="500" height="350" alt="" />                          
                       </a>
                       <br />
                       <br />
                       
                       <h3><Icon circular inverted color='blue' name='eye' />Bote</h3>
                         <br/>
                        <form onSubmit={(event) => {
                              event.preventDefault();                              
                              const mensaje = "Bote total de la lotería en ejecución...";
                              this.viewBote(mensaje);
                         }
                       }>                    
                          
                          <input type="submit" className="bbtn btn-block btn-primary btn-sm" value="BOTE" />
                        </form>                       
                        <br/><br/>
                       <h3><Icon circular inverted color='orange' name='money bill alternate outline' />Precio boleto</h3>
                         <br/>
                        <form onSubmit={(event) => {
                              event.preventDefault();                              
                              const mensaje = "Precio del boleto de la lotería en ejecución...";
                              this.viewPriceBoleto(mensaje);
                         }
                       }>                    
                          
                          <input type="submit" className="bbtn btn-block btn-info btn-sm" value="PRECIO DEL BOLETO" />
                        </form>

                        <br/><br/>
                       <h3><Icon circular inverted color='yellow' name='payment' />Comprar boletos</h3>
                         <br/>
                        <form onSubmit={(event) => {
                              event.preventDefault();                              
                              const numTokens = this.numTokens.value;
                              const mensaje = "Compra de tickets de la lotería en ejecución...";
                              this.buyTickets(numTokens, mensaje);
                         }
                       }>                    
                          <input type="text" className="form-control mb-1" placeholder="Número de boletos a comprar" 
                              ref={(input) => this.numTokens = input} />
                          <input type="submit" className="bbtn btn-block btn-warning btn-sm" value="COMPRAR BOLETOS" />
                        </form>
                       </div>
                    </main>
                </div>
                </div>
            </div>
        )
    }
}

export default Loteria