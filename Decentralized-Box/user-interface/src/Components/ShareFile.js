// Import the useEffect hook from the React library
import { useEffect } from "react";

// Import the ShareFile.css styles
import "./ShareFile.css";

// Define the ShareFile component
const ShareFile = ({ setModalOpen, contract }) => {
  
  // Define a function to allow users to access the shared file
  const sharing = async () => {
    // Get the inputted address from the address field
    const address = document.querySelector(".address").value;
    // Allow the specified user to access the file
    await contract.allowUser(address);
    // Close the modal dialog
    setModalOpen(false);
    // Display an alert indicating that access has been shared
    alert(`Access shared to ${address}`)
  };

  // Define a function to revoke access to the shared file
  const revoking = async () => {
    // Revoke access for all users
    await contract.disallowAll();
    // Clear the list of allowed addresses in the dropdown menu
    let select = document.querySelector("#selectNumber");
    select.innerHTML = "";
    // Close the modal dialog
    setModalOpen(false);
    // Display an alert indicating that access has been revoked
    alert("Revoked Access to all Addresses")
  };

  // Use the useEffect hook to fetch the list of allowed addresses from the contract
  useEffect(() => {
    const accessList = async () => {
      // Get the list of allowed addresses from the contract
      const addressList = await contract.shareAccess();
      // Get the select element for the dropdown menu
      let select = document.querySelector("#selectNumber");
      
      // Check if the select element already has any options
      if (select.options.length === 1) {
        // If the select element has no options, add each address in the list as an option
        const options = addressList;

        for (let i = 0; i < options.length; i++) {
          let opt = options[i];
          let e1 = document.createElement("option");
          e1.textContent = opt;
          e1.value = opt;
          select.appendChild(e1);
        }
      }
    };
    // Call the accessList function when the contract is loaded
    contract && accessList();
  }, [contract]);

  // Render the ShareFile component
  return (
    <>
      <div className="modalContainer">
        <div className="title"><h2>Share with</h2></div>
        <div className="body">
          <input
            type="text"
            className="address"
            placeholder="Enter Address"
          ></input>
        </div>
        <form id="myForm">
          <select id="selectNumber">
            <option className="address">People With Access</option>
          </select>
        </form>
        <div className="footer">
          <button
            onClick={() => {
              setModalOpen(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={() => sharing()}>Share</button>
          <button onClick={() => revoking()} id="revoke">RevokeAll</button>
        </div>
      </div>
    </>
  );
};

// Export the ShareFile component
export default ShareFile;
