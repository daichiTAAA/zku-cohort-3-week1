const { expect } = require('chai');
const { ethers } = require('hardhat');
const fs = require('fs');
const { groth16, plonk } = require('snarkjs');

function unstringifyBigInts(o) {
  if (typeof o == 'string' && /^[0-9]+$/.test(o)) {
    return BigInt(o);
  } else if (typeof o == 'string' && /^0x[0-9a-fA-F]+$/.test(o)) {
    return BigInt(o);
  } else if (Array.isArray(o)) {
    return o.map(unstringifyBigInts);
  } else if (typeof o == 'object') {
    if (o === null) return null;
    const res = {};
    const keys = Object.keys(o);
    keys.forEach((k) => {
      res[k] = unstringifyBigInts(o[k]);
    });
    return res;
  } else {
    return o;
  }
}

describe('HelloWorld', function () {
  let Verifier;
  let verifier;

  beforeEach(async function () {
    Verifier = await ethers.getContractFactory('HelloWorldVerifier');
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it('Should return true for correct proof', async function () {
    //[assignment] Add comments to explain what each line is doing
    //Get proof and publicSignals that are the result of the CIRCUIT calculation
    //using the fullProve function of groth16 in snarkjs.
    //In this case, the first argument of the fullProve function is the input to the circuit.
    //The second aurgumet is the Wasm code needed to generate the witness.
    //The third arugument is verification key.
    const { proof, publicSignals } = await groth16.fullProve(
      { a: '1', b: '2' },
      'contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm',
      'contracts/circuits/HelloWorld/circuit_final.zkey'
    );

    console.log('1x2 =', publicSignals[0]);

    //Changing the type of elements of publicSignals to BigInt.
    const editedPublicSignals = unstringifyBigInts(publicSignals);
    //Changing the type of elements of proof to BigInt.
    const editedProof = unstringifyBigInts(proof);
    //Change the elements of "proof" and "publicSignals" to hexadecimal numbers with a prefix of 0x,
    //for publicSignals, add the elements together and align them to a fixed length of 0.
    //put them in an array,
    //separate them with "," and
    //combine them into a single string and assign it to calldata.
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );

    //After removing unnecessary characters, each element separated by ',' is
    //put into one array, and each element of the array is converted once to BigInt and
    //then to a decimal string.
    const argv = calldata
      .replace(/["[\]\s]/g, '')
      .split(',')
      .map((x) => BigInt(x).toString());

    //After converting the values as above, assign
    //an array containing the elements of pi_a of proof to a,
    //an array containing the elements of pi_b of proof to b,
    //an array containing the elements of pi_c of proof to c,
    //and the total value of publicSignals, the result of the circuit calculation, to Input.
    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    //Assign a, b, c, Input to the verifyProof method of the contract deployed to hardhat,
    //and make it pass if the return value is true.
    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
  });
  it('Should return false for invalid proof', async function () {
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let d = [0];
    expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
  });
});

describe('Multiplier3 with Groth16', function () {
  beforeEach(async function () {
    //[assignment] insert your script here
    Verifier = await ethers.getContractFactory('Multiplier3Verifier');
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it('Should return true for correct proof', async function () {
    //[assignment] insert your script here
    const { proof, publicSignals } = await groth16.fullProve(
      { a: '1', b: '2', c: '3' },
      'contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm',
      'contracts/circuits/Multiplier3/circuit_final.zkey'
    );

    console.log('1x2x3 =', publicSignals[0]);
    // console.log('Groth16 proof is: ', proof);

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);
    const calldata = await groth16.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );

    const argv = calldata
      .replace(/["[\]\s]/g, '')
      .split(',')
      .map((x) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = argv.slice(8);

    expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
  });
  it('Should return false for invalid proof', async function () {
    //[assignment] insert your script here
    let a = [0, 0];
    let b = [
      [0, 0],
      [0, 0],
    ];
    let c = [0, 0];
    let d = [0];
    expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
  });
});

describe('Multiplier3 with PLONK', function () {
  beforeEach(async function () {
    //[assignment] insert your script here
    Verifier = await ethers.getContractFactory('PlonkVerifier');
    verifier = await Verifier.deploy();
    await verifier.deployed();
  });

  it('Should return true for correct proof', async function () {
    //[assignment] insert your script here
    const { proof, publicSignals } = await plonk.fullProve(
      { a: '1', b: '2', c: '3' },
      'contracts/circuits/_plonkMultiplier3/Multiplier3_js/Multiplier3.wasm',
      'contracts/circuits/_plonkMultiplier3/circuit_final.zkey'
    );

    console.log('1x2x3 =', publicSignals[0]);
    // console.log('plonk proof is: ', proof);

    const editedPublicSignals = unstringifyBigInts(publicSignals);
    const editedProof = unstringifyBigInts(proof);
    const calldata = await plonk.exportSolidityCallData(
      editedProof,
      editedPublicSignals
    );

    const argv = calldata.split(',');
    const argv2 = argv[1].split();
    argv[1] = argv2.map((x) => x.replace(/\[|\]|'|"/g, ''));

    expect(await verifier.verifyProof(argv[0], argv[1])).to.be.true;
  });
  it('Should return false for invalid proof', async function () {
    //[assignment] insert your script here
    // argv = [
    //   '0x2208cb24b047b5ebcb44cff09b9b1bb197ad663313bdb0c9f04b24ee38b925c707043df65d64671128b5dcca307e0dce3d91c20afa886113ed890863ce329ee109a55f0578ffd0bfe11f0176af9351e5fa7c667117d5280588d5292e3c9ca18c29d9e59ff02efa902c6ed8fbd3d5599fe16712090a59b6d5c8875475255d46cd2e1ef72830d62bc382260409e849195da370bc2bb82d6995755184dc62c378a10e016fd47c96ceac5bf723d3f5b9f17c00c897afa73166c9c979548e045142751740f75c0acb6d284e92b59651ca9efd9e86d929d6f5092da7bea856de78000d0eac1fc2187a4377d6481db085b3e26dc4aa61b0577de4cba7eb269007e7f2bf226067b1c23c72f49a0be9c14f07fc88a81f651f2883a7baf6059d0da55398bd25f3c1778e9a2cea47176d2369bf56bcbb5f5ca75a715b6c56c55b1b130ead6a017abd62b7257f38db1a4c68bc2ff8f04b9449beca850492bc3fe68b3941b4c9170b46de615fb25c708f33619d48a424fb586c92e790bd4707f3844570abfba81dd1fd9900887c40e3ddccd685620dda12b1595be36e080cf76f5c6adfb95f97035244ff0bfb4230ea2f640ec033998f8053b9ccd1eac986c2d6b769dc849a44277cd699a8a881bdd2cb12be1f228c552cb74dcd04c5f2fb8c977bae4edd49810f5d3953778af8091ab000996e0f46ece063ffe063085203689d42100b7d1f2f2526a019a1d378596dbb631bb47d8cb540253b27d4022137754d65be2129410c012ac13f66a7f71fd13a10129918ee058409a9278e0d212a7a943f28e8d6127029abd8c2651d869687e2e9721c62ad3081c4a1eb2e2c3bccb9a3c449926b40db0acc0e3bd29385f64b2e9ec9c9c0a70200d843a821a28aef81f0b5f95f97b8e316a52d1cfbeccbcbd52852e9b072c42066fc6c178fdb7e53fcc55403de1bde25097b2a95d49952dbda9de6c2c3b09a4f5151d91075f0c166658fdca70512dec92efa4a547d644bcb1cb5b3a4971dc18a95711bc626931c81199126afca602e9428231294b0eab1871bc1c2a792fcc9608c93bc5b991f3a0289bf675e951b2b1115524cadeefb87de3a72de14c14569d9f950941bed75b115f5620d80a71f9f8a',
    //   ['0x0000000000000000000000000000000000000000000000000000000000000006'],
    // ];
    // argv[0] = argv[0].replace(/\w/g, '0');
    // argv[0] = '0x' + argv[0].slice(2);
    // argv[1] = [argv[1][0].replace(/\w/g, '0')];
    // argv[1] = ['0x' + argv[1][0].slice(2)];

    argv = [
      '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      ['0x0000000000000000000000000000000000000000000000000000000000000000'],
    ];

    expect(await verifier.verifyProof(argv[0], argv[1])).to.be.false;
  });
});
