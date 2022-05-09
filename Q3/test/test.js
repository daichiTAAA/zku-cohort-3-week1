// const { expect } = require('chai');
// const { ethers } = require('hardhat');
// const fs = require('fs');
const { groth16, plonk } = require('snarkjs');

// function unstringifyBigInts(o) {
//   if (typeof o == 'string' && /^[0-9]+$/.test(o)) {
//     return BigInt(o);
//   } else if (typeof o == 'string' && /^0x[0-9a-fA-F]+$/.test(o)) {
//     return BigInt(o);
//   } else if (Array.isArray(o)) {
//     return o.map(unstringifyBigInts);
//   } else if (typeof o == 'object') {
//     if (o === null) return null;
//     const res = {};
//     const keys = Object.keys(o);
//     keys.forEach((k) => {
//       res[k] = unstringifyBigInts(o[k]);
//     });
//     return res;
//   } else {
//     return o;
//   }
// }

// describe('LessThan10 with PLONK', function () {
//   beforeEach(async function () {
//[assignment] insert your script here
// Verifier = await ethers.getContractFactory('LessThan10Verifier');
// verifier = await Verifier.deploy();
// await verifier.deployed();
// });

// it('Should return true for correct proof', async function () {
//[assignment] insert your script here

async function lessThan10Test() {
  const { proof, publicSignals } = await plonk.fullProve(
    { in: 50 },
    'contracts/circuits/LessThan10/LessThan10_js/LessThan10.wasm',
    'contracts/circuits/LessThan10/circuit_final.zkey'
  );
  console.log('input 50, and then output is: ', publicSignals);
  return;
}

async function rangeProofFrom1To10Test() {
  const { proof, publicSignals } = await plonk.fullProve(
    { in: 0 },
    'contracts/circuits/RangeProofFrom1To10/RangeProofFrom1To10_js/RangeProofFrom1To10.wasm',
    'contracts/circuits/RangeProofFrom1To10/circuit_final.zkey'
  );
  console.log('input 5, and then output is: ', publicSignals[0]);
  return;
}

// lessThan10Test();
rangeProofFrom1To10Test();

// console.log('plonk proof is: ', proof);

// const editedPublicSignals = unstringifyBigInts(publicSignals);
// const editedProof = unstringifyBigInts(proof);
// const calldata = await plonk.exportSolidityCallData(
//   editedProof,
//   editedPublicSignals
// );

// const argv = calldata.split(',');
// const argv2 = argv[1].split();
// argv[1] = argv2.map((x) => x.replace(/\[|\]|'|"/g, ''));

// expect(await verifier.verifyProof(argv[0], argv[1])).to.be.true;
// });
// it('Should return false for invalid proof', async function () {

//   argv = [
//     '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//     ['0x0000000000000000000000000000000000000000000000000000000000000000'],
//   ];

//   expect(await verifier.verifyProof(argv[0], argv[1])).to.be.false;
// });
// });
