pragma circom 2.0.0;

include "./RangeProof.circom";

template RangeProofLow1High10() {
    signal input in;
    signal output out;

    component rp = RangeProof(32); 

    rp.in <== in;
    rp.range[0] <== 1;
    rp.range[1] <== 10;

    out <== rp.out;
}

component main = RangeProofLow1High10();