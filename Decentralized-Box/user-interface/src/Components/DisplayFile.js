import { useState } from "react";
import "./DisplayFile.css";

const DisplayFile = ({ contract, account }) => {
  // Set up state to store data fetched from the contract
  const [data, setData] = useState([]);

  // Define function to handle form submission and retrieve data from the contract
  const handleGetdata = async (event) => {
    event.preventDefault();
    const otherAddress = event.target.elements.address.value.trim();
    try {
      // Call contract method to retrieve data from the blockchain
      const dataArray = await contract.displayData(otherAddress);
      // Update state with data returned from the contract
      setData(dataArray);
    } catch (error) {
      console.error(error);
      // Display error message if data retrieval fails
      alert("Failed to get data. Please try again.");
    }
  };

  // Define function to render a list of links to the data files
  const renderImageList = () => {
    if (data.length === 0) {
      // Display message if there is no data to show
      return <p>No Files to display.</p>;
    }

    return (
      <div className="file-list">
        {data.map((item, i) => (
          <div key={i} className="button-list-item">
            {/* Display link to file */}
            <a href={item} target="_blank" rel="noreferrer" className="button-link">
              {"FILE " + (i+1)}
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleGetdata}>
      {/* Render list of links to files */}
      {renderImageList()}
      <div>
        {/* Input field to allow user to enter an address */}
        <input
          type="text"
          placeholder="Enter address"
          name="address"
          className="address"
        />
        {/* Button to trigger data retrieval */}
        <button type="submit" className="button">
          Get Data
        </button>
      </div>
    </form>
  );
};

export default DisplayFile;
