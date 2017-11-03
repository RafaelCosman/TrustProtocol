// import Web3 from 'web3';
import * as _Marketplace from "./contracts/Marketplace.json";
import * as _Trusts from "./contracts/Trusts.json";
import * as _ from "lodash";
// import _Requests from "../contracts/Requests.json";

// import ethUtil from "ethereumjs-util";
// import * as Promise from "es6-promise";

// const provider = new Web3.providers.HttpProvider("https://ropsten.infura.io:dYWKKqsJkbv9cZlQFEpI")
// const web3 = new Web3(provider)

const promisify = (inner: any) =>
  new Promise((resolve:any, reject:any) =>
    inner((err:any, res:any) => {
      if (err) { reject(err) }
      resolve(res);
    })
  );

export class Marketplace {
    web3: any;
    abi: any;
    location: string;
    contract: any;

    constructor(web3: any){
        this.web3 = web3;
        this.abi = _Marketplace["abi"];
        this.location = "0xfa4f59b6c6a68ee59128bd5ae974fdbb080ad5c0";
        this.contract = new this.web3.eth.Contract(this.abi, this.location)
        return this;
    }

    async owner(){
        return await promisify(this.contract.methods.owner().call);
    }

    async trusts(){
        const address = await promisify(this.contract.methods.trusts().call);
        return new Trusts(this.web3, address);
    }
}

export class Trusts {
    web3: any;
    abi: any;
    location: string;
    contract: any;

    constructor(web3, location){
        this.web3 = web3;
        this.abi = _Trusts["abi"];
        this.location = location;
        this.contract = new this.web3.eth.Contract(this.abi, this.location)
    }

    _format(trust:any) {
        return {client: trust[0], name: this.web3.utils.hexToAscii(trust[1])} 
    }

    async get(params:any){
        const item = await promisify(this.contract.methods.get(params).call);
        return this._format(item);
    }

    async getCount(){
        return await promisify(this.contract.methods.getCount().call);
    }

    async getAll(){
        const count:any = await this.getCount();
        console.log("GOT IT!", count)
        return await Promise.all(
            _.range(count).map(i => this.get(i))
        )
    }
}