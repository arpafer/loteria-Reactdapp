import React, { Component } from "react";
import "./App.css";
import Web3 from "web3";
import contratoLoteria from "../abis/Loteria.json";
import tokensImages from "../imagenes/tokens.png";
import {Icon} from "semantic-ui-react";

class Tokens extends Component {
   
    constructor(props) {
       super(props);
       this.state = {
           contract: null,
           account: "",
           loading: false,
           errorMessage: "",
           compradorTokens: "",
           cantidad: 0,
           balanceDireccion: "",
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
        console.log("networkid: " + networkdId);
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

    envio = async(compradorTokens, cantidad, ethers, mensaje) => {
       try {
           console.log(mensaje);
           const web3 = window.web3;
           const accounts = await web3.eth.getAccounts();
           await this.state.contract.methods.buyTokens(compradorTokens, cantidad).send({from: accounts[0], value: ethers});
       } catch (err) {
           this.setState({errorMessage: err.message});
       } finally {
           this.setState({loading: false});           
       }
    }

    viewBalancePersona = async(direccion, mensaje) => {
        try {
            console.log(mensaje);
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            const balanceDireccion = await this.state.contract.methods.getBalanceMisTokens(direccion).call();
            alert(parseFloat(balanceDireccion));
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({loading: false});           
        }
     }     

     viewBalanceContrato = async(mensaje) => {
        try {
            console.log(mensaje);            
            const balanceContrato = await this.state.contract.methods.getBalanceContrato().call();
            alert(parseFloat(balanceContrato));
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({loading: false});           
        }
     }
     
     addTokens = async(numTokens, mensaje) => {
        try {
            console.log(mensaje);    
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();        
            await this.state.contract.methods.addTokens(numTokens).send({from:accounts[0]});
            
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({loading: false});           
        }
     }

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
                      <h2>Gestión y control de Tokens de la Lotería</h2>
                      <a href="https://www.linkedin.com/in/antonio-p-a2a1352a/" target="_blank" rel="noopener noreferrer">
                          <br />
                          <img src={tokensImages} width="450" height="400" alt="" />                          
                       </a>
                       <br />
                       <br />
                       <h3><Icon circular inverted color='red' name='users' />Compra tokens ERC-20</h3>
                       <form onSubmit={(event) => {
                              event.preventDefault()
                              const compradorTokens = this.compradorTokens.value;
                              const cantidad = this.cantidad.value;
                              const web3 = window.web3;
                              const ethers = web3.utils.toWei(this.cantidad.value, "ether");
                              const mensaje = "Compra de tokens en ejecución...";
                              this.envio(compradorTokens, cantidad, ethers, mensaje);
                         }
                       }> 
                         <input type="text" className="form-control mb-1" placeholder="Dirección de envío de los tokens" ref={(input) => this.compradorTokens = input} />
                         <br />
                         <input type="text" className="form-control mb-1" placeholder="Cantidad de tokens a comprar" ref={(input) => this.cantidad = input} />
                         <br/>
                         <input type="submit" className="bbtn btn-block btn-danger btn-sm" value="COMPRAR TOKENS" />
                       </form>
                       <br/><br/>
                       <h3><Icon circular inverted color='green' name='bitcoin' />Balance de tokens de un usuario</h3>

                       <form onSubmit={(event) => {
                              event.preventDefault()
                              const balanceDireccion = this.balanceDireccion.value;                              
                              const mensaje = "Obtención del balance de tokens...";
                              this.viewBalancePersona(balanceDireccion, mensaje);
                         }
                       }> 
                         <input type="text" className="form-control mb-1" placeholder="Dirección del usuario" ref={(input) => this.balanceDireccion = input} />
                         <input type="submit" className="bbtn btn-block btn-success btn-sm" value="BALANCE USUARIO" />
                        </form>
                         <br /><br />

                         <h3><Icon circular inverted color='yellow' name='bitcoin' />Balance de tokens del Smart Contract</h3>
                         <br/>
                        <form onSubmit={(event) => {
                              event.preventDefault()                              
                              const mensaje = "Obtención del balance del contrato...";
                              this.viewBalanceContrato(mensaje);
                         }
                       }>                          
                         <input type="submit" className="bbtn btn-block btn-warning btn-sm" value="BALANCE SMART CONTRACT" />
                        </form>
                        
                        <br/><br/>
                        <h3><Icon circular inverted color='blue' name='bitcoin' />Incrementar tokens del Smart Contract</h3>
                         <br/>
                        <form onSubmit={(event) => {
                              event.preventDefault();
                              const numTokens = this.numTokens.value;
                              const mensaje = "Incremento de tokens del Smart Contract en ejecución...";
                              this.addTokens(numTokens, mensaje);
                         }
                       }>                    
                         <input type="text" className="form-control mb-1" placeholder="Número de tokens a incrementar" ref={(input) => this.numTokens = input} />
                         <input type="submit" className="bbtn btn-block btn-primary btn-sm" value="INCREMENTO DE TOKENS" />
                        </form>
                    </div>
                    </main>
                </div>
                </div>
            </div>

        )
    }
}

export default Tokens