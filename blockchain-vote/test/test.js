const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting;
  let voting;
  let owner;
  let voters;
  let outsider;

  beforeEach(async function () {
    [owner, ...accounts] = await ethers.getSigners();
    voters = accounts.slice(0, 5); // İlk 5 hesap seçmen
    outsider = accounts[5];       // Yetkisiz biri

    const voterAddresses = voters.map(v => v.address);
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(voterAddresses);
  });

  it("1 - Sözleşme deploy ediliyor", async function () {
    expect(voting.target).to.properAddress;
  });

  it("2 - Kayıtlı seçmen oy kullanabiliyor", async function () {
    await voting.connect(voters[0]).vote(true);
    const [a, b] = await voting.getVotes();
    expect(a).to.equal(1);
    expect(b).to.equal(0);
  });

  it("3 - Kayıtlı olmayan hesap oy kullanamaz", async function () {
    await expect(voting.connect(outsider).vote(false))
      .to.be.revertedWith("Oy kullanma yetkiniz yok.");
  });

  it("4 - Seçmen sadece 1 kez oy kullanabilir", async function () {
    await voting.connect(voters[1]).vote(false);
    await expect(voting.connect(voters[1]).vote(true))
      .to.be.revertedWith("Bu adres zaten oy kullandi.");
  });

  it("5 - Oy sayacı doğru artıyor (tek oy)", async function () {
    await voting.connect(voters[2]).vote(true);
    const [a, b] = await voting.getVotes();
    expect(a).to.equal(1);
  });

  it("6 - İki seçmen aynı adaya oy verince sayaç +2", async function () {
    await voting.connect(voters[3]).vote(false);
    await voting.connect(voters[4]).vote(false);
    const [a, b] = await voting.getVotes();
    expect(b).to.equal(2);
  });

  it("7 - Owner olmayan biri seçimi bitiremez", async function () {
    await expect(voting.connect(voters[0]).endVoting())
      .to.be.revertedWith("Sadece owner bu islemi yapabilir.");
  });

  it("8 - Oylama bittikten sonra oy kullanılamaz", async function () {
    await voting.connect(owner).endVoting();
    await expect(voting.connect(voters[0]).vote(true))
      .to.be.revertedWith("Oy verme islemi sona erdi.");
  });
});
