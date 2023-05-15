import dStorage from "./artifacts/contracts/dStorage.sol/dStorage.json"; // Importing the JSON file containing the ABI of the smart contract
import { useState, useEffect } from "react"; // Importing hooks from the React library
import { ethers } from "ethers"; // Importing the ethers.js library
import FileUpload from "./Components/UploadFile"; // Importing the FileUpload component
import Display from "./Components/DisplayFile"; // Importing the Display component
import Modal from "./Components/ShareFile"; // Importing the Modal component
import "./App.css"; // Importing the App.css file

function App() {
  const [account, setAccount] = useState(""); // Creating a state variable for the account address and initializing it with an empty string
  const [contract, setContract] = useState(null); // Creating a state variable for the smart contract and initializing it with null
  const [provider, setProvider] = useState(null); // Creating a state variable for the provider and initializing it with null
  const [modalOpen, setModalOpen] = useState(false); // Creating a state variable for the modal and initializing it with false

  useEffect(() => { // useEffect hook to run the following code when the component mounts
    const provider = new ethers.providers.Web3Provider(window.ethereum); // Creating a new instance of Web3Provider and passing the ethereum object provided by the window object

    const loadProvider = async () => { // Declaring an async function to load the provider
      if (provider) { // Checking if provider exists
        window.ethereum.on("chainChanged", () => { // Listening to the chainChanged event and reloading the page when it is triggered
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => { // Listening to the accountsChanged event and reloading the page when it is triggered
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []); // Sending a request to the user to connect their Ethereum account
        const signer = provider.getSigner(); // Creating a new signer object
        const address = await signer.getAddress(); // Getting the address of the signer object
        setAccount(address); // Setting the account variable to the address
        let contractAddress = "0x996eFcF698c4a15C7CA48b55d280D0849C658Da2"; // Storing the address of the deployed smart contract

        const contract = new ethers.Contract( // Creating a new instance of the smart contract and passing the address, ABI, and signer object
          contractAddress,
          dStorage.abi,
          signer
        );
        setContract(contract); // Setting the contract variable to the new instance of the smart contract
        setProvider(provider); // Setting the provider variable to the Web3Provider instance
      } else {
        console.error("Metamask is not installed"); // Logging an error message if provider is null
      }
    };
    provider && loadProvider(); // Calling the loadProvider function if provider exists
  }, []); // Running the effect only once when the component mounts
  return (
    <>
      <h1 data-text="DECENBOX">DECENBOX</h1>
      <div className="App">
        <div className="temp">
          <h3 className="acc">Account: {account || "Not connected"}</h3>

          {account && !modalOpen && (
            <button className="share" onClick={(e) => {
              e.preventDefault(); // Prevents the default behavior of the button
              setModalOpen(true); // Opens the modal
            }}>
              Share
            </button>
          )}

          {modalOpen && (
            <Modal setModalOpen={setModalOpen} contract={contract} />
          )}

          <FileUpload account={account} provider={provider} contract={contract} />
          <Display contract={contract} account={account} />
        </div>
      </div>
    </>
  );
}

export default App;
