import { useState } from "react"; // Import useState hook from React
import axios from "axios"; // Import axios library for making HTTP requests
import "./UploadFile.css"; // Import CSS file for styling

  const UploadFile = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null); // Declare state variable for selected file
  const [fileName, setFileName] = useState("No file selected"); // Declare state variable for file name
  const formData = new FormData(); // Declare formData variable
  let x="25c1f44b573e48919f5f";
  let y="8a81b8bc9943e07f8bd4e9de40e79fb715ecd10f6ec68d84f48ce37b106d5a8e";
  // Function to upload file to Pinata
  const handleUpload = async () => {
    try {
      // Make a POST request to Pinata API to upload the file
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          // Set Pinata API keys and Content-Type header for multipart/form-data
          pinata_api_key: x,
          pinata_secret_api_key: y,
          "Content-Type": "multipart/form-data",
        },
      });
      return resFile.data.IpfsHash; // Return the IPFS hash of the uploaded file
    } catch (e) {
        console.error(e); // Log any errors to the console
        throw new Error("Unable to upload file to Pinata"); // Throw an error if the file upload fails
      }
    };
  
    // Function to add file hash to contract
    const handleAddToContract = async (hash) => {
        try {
            // Call the 'add' function on the smart contract with the account and IPFS URL of the uploaded file
            await contract.add(account, `https://gateway.pinata.cloud/ipfs/${hash}`);
            console.log("Successfully added file to contract"); // Log a success message to the console
          } catch (e) {
              console.error(e); // Log any errors to the console
      throw new Error("Unable to add file hash to contract"); // Throw an error if adding the file hash to the contract fails
    }
  };
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (file) { // If a file has been selected
      try {
        formData.append("file", file); // Append the selected file to the formData object
        const hash = await handleUpload(); // Upload the file to Pinata and get the IPFS hash
        await handleAddToContract(hash); // Add the IPFS hash to the smart contract
        alert("Successfully uploaded file and added to contract"); // Show a success message in an alert box
      } catch (e) {
        alert(e.message); // Show an error message in an alert box
      }
      setFileName("No file selected"); // Reset the file name to "No file selected"
      setFile(null); // Reset the selected file to null
    }
  };
  // Function to retrieve selected file from input
  const retrieveFile = (e) => {
    const data = e.target.files[0]; // Get selected file from input
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]); // Set selected file to state variable
    };
    setFileName(e.target.files[0].name); // Set file name to state variable
    e.preventDefault();
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    setFile(null); // Reset selected file to default
    setFileName("No file selected"); // Reset file name to default
  };
  

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose File
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">File: {fileName}</span>
        <button className="cancel" onClick={handleCancel} disabled={!file}>
          Cancel
        </button>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default UploadFile;
