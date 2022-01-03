import * as crypto from 'crypto';

class Transaction {
    constructor(
        public amount: number,
        public payer: string, //public key
        public payee: string //public key
    ) {}

    toString(){
        return JSON.stringify(this);
    }
}

class Block {
    constructor(
        public prevHash: string,
        public transaction: Transaction,
        public ts = Date.now()
    ) {}

    get hash(){
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(str).end();
        return hash.digest('hex')
    }

}

class Chain {
    public static instance = new Chain()

    chain: Block[];

    constructor(){
        this.chain = [new Block('', new Transaction(100, 'genesis', 'satoshi'))]
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(transaction: Transaction, senderPublicKey: string, signature: string){
        const newBlock = new Block(this.lastBlock.hash, transaction);
        this.chain.push(newBlock);
    }

}

class Wallet {
    public publicKey: string;
    public privateKey: string;

    constructor(){
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'}
        });

        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
    }

}