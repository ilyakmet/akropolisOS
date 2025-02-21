import { PoolContract, PoolInstance} from "../types/truffle-contracts/index";
// tslint:disable-next-line:no-var-requires
const { BN, constants, expectEvent, shouldFail } = require("@openzeppelin/test-helpers");
// tslint:disable-next-line:no-var-requires
const should = require("chai").should();

const Pool = artifacts.require("Pool");

contract("Pool", async ([_, owner,  wallet1, wallet2, wallet3, wallet4, wallet5]) => {
    let pool: PoolInstance;
  
    before(async () => {
        pool = await Pool.new();
        await pool.initialize(owner, {from: owner});
        const address = await pool.owner();
        await pool.setMetadata("creditPool", "Great Pool",  {from: address});
    });

    it("should have proper owner", async () => {
        const address = await pool.owner();
        (await pool.founder()).should.equal(address);
    });
    
    it("should have proper name", async () => {
        (await pool.name()).should.equal("creditPool");
    });

    it("should have proper description", async () => {
        (await pool.description()).should.equal("Great Pool");
    });

    it("should set new module for given name", async () => {
        const input = {
            _name: 'Node1',
            _module: wallet5,
            _constant: true,
        };

        await pool.set(
            input._name,
            input._module,
            input._constant,
            { 
                from: owner,
            }
        );

        (
            await pool.isConstant(input._name) && 
            (await pool.size()).toNumber() === 1 && 
            await pool.getName(wallet5) === 'Node1' &&
            await pool.first() === wallet5 &&
            await pool.get(input._name) === wallet5
        )
        .should.equal(true);
    });

    it("should remove module by name", async () => {
        const input = {
            _name: 'Node1',
        };

        await pool.remove(
            input._name,
            { 
                from: owner,
            }
        );

        (
            !await pool.isConstant(input._name) && 
            (await pool.size()).toNumber() === 0 && 
            await pool.getName(wallet5) === '' &&
            await pool.first()  === '0x0000000000000000000000000000000000000000' &&
            await pool.get(input._name) === '0x0000000000000000000000000000000000000000'
        )
        .should.equal(true);
    });
});
