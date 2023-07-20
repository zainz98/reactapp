import React, { Component } from 'react';
import { variables } from './Variables.js';

export class Comp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comps: [],
      Full_Name: '',
      Phone_Number: '',
      IP_Address: '',
      Id: 0,

      IdFilter: '',
      Full_NameFilter: '',
      Phone_NumberFilter: '',
      IP_AddressFilter: '',

      location: '', // New state field to store the location
    };
  }

  // Function to fetch the location using the IP-API
  fetchLocationByIP() {
    const { IP_Address } = this.state;
    fetch(`https://ip-api.com/json/${IP_Address}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          // Assuming you have a location field in the comps data
          this.setState({
            location: data.city + ', ' + data.country,
          });
        } else {
          alert('Failed to fetch location.');
        }
      })
      .catch((error) => {
        alert('Failed to fetch location.');
      });
  }

  // Function to check the validity of Full Name
  isFullNameValid = (fullName) => {
    return fullName.trim() !== '';
  };

  // Function to check the validity of Phone Number
  isPhoneNumberValid = (phoneNumber) => {
    return phoneNumber.trim() !== '';
  };

  // Function to check the validity of IP Address
  isIpAddressValid = (ipAddress) => {
    return ipAddress.trim() !== '';
  };

  FilterFn() {
    var Full_NameFilter = this.state.Full_NameFilter;
    var Phone_NumberFilter = this.state.Phone_NumberFilter;
    var IP_AddressFilter = this.state.IP_AddressFilter;

    var filteredData = this.state.compsWithoutFilter.filter(function (el) {
      return (
        el.Full_Name.toString().toLowerCase().includes(Full_NameFilter.toString().trim().toLowerCase()) &&
        el.Phone_Number.toString().toLowerCase().includes(Phone_NumberFilter.toString().trim().toLowerCase()) &&
        el.IP_Address.toString().toLowerCase().includes(IP_AddressFilter.toString().trim().toLowerCase())
      );
    });

    this.setState({ comps: filteredData });
  }

  sortResult(prop, asc) {
    var sortedData = this.state.compsWithoutFilter.sort(function (a, b) {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    this.setState({ comps: sortedData });
  }

  changeFull_NameFilter = (e) => {
    this.setState({ Full_NameFilter: e.target.value }, () => this.FilterFn());
  };

  changePhone_NumberFilter = (e) => {
    this.setState({ Phone_NumberFilter: e.target.value }, () => this.FilterFn());
  };

  changeIP_AddressFilter = (e) => {
    this.setState({ IP_AddressFilter: e.target.value }, () => this.FilterFn());
  };

  refreshList() {
    fetch(variables.API_URL + 'department')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ comps: data, compsWithoutFilter: data });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  changeFull_Name = (e) => {
    this.setState({ Full_Name: e.target.value });
  };

  changePhone_Number = (e) => {
    this.setState({ Phone_Number: e.target.value });
  };

  changeIP_Address = (e) => {
    this.setState({ IP_Address: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: 'Add client',
      Id: 0,
      Full_Name: '',
      Phone_Number: '',
      IP_Address: '',
    });
  }

  editClick(comp) {
    this.setState({
      modalTitle: 'Edit client',
      Id: comp.Id,
      Full_Name: comp.Full_Name,
      Phone_Number: comp.Phone_Number,
      IP_Address: comp.IP_Address,
    });
  }

  createClick() {
    const { Full_Name, Phone_Number, IP_Address } = this.state;

    if (!this.isFullNameValid(Full_Name)) {
      alert('Invalid Full Name');
      return;
    }

    if (!this.isPhoneNumberValid(Phone_Number)) {
      alert('Invalid Phone Number');
      return;
    }

    if (!this.isIpAddressValid(IP_Address)) {
      alert('Invalid IP Address');
      return;
    }

    fetch(variables.API_URL + 'department', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Full_Name,
        Phone_Number,
        IP_Address,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert('Failed');
        }
      );
  }

  updateClick() {
    const { Id, Full_Name, Phone_Number, IP_Address } = this.state;

    if (!this.isFullNameValid(Full_Name)) {
      alert('Invalid Full Name');
      return;
    }

    if (!this.isPhoneNumberValid(Phone_Number)) {
      alert('Invalid Phone Number');
      return;
    }

    if (!this.isIpAddressValid(IP_Address)) {
      alert('Invalid IP Address');
      return;
    }

    fetch(variables.API_URL + 'department', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id,
        Full_Name,
        Phone_Number,
        IP_Address,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert('Failed');
        }
      );
  }

  deleteClick(id) {
    if (window.confirm('Are you sure?')) {
      fetch(variables.API_URL + 'department/' + id, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            alert(result);
            this.refreshList();
          },
          (error) => {
            alert('Failed');
          }
        );
    }
  }

  render() {
    const {
      comps,
      modalTitle,
      Id,
      Full_Name,
      Phone_Number,
      IP_Address,
      location, // New state field to store the location
    } = this.state;

    return (
      <div>
        <button
          type="button"
          className="btn btn-primary m-2 float-end"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => this.addClick()}
        >
          Add client
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <div className="d-flex flex-row">
                  <input
                    className="form-control m-2"
                    onChange={this.changeFull_NameFilter}
                    placeholder="Filter"
                  />

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => this.sortResult('Full_Name', true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-down-square-fill"
                      viewBox="0 0 16 16"
                    >
                      {/* ... SVG paths ... */}
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => this.sortResult('Full_Name', false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-up-square-fill"
                      viewBox="0 0 16 16"
                    >
                      {/* ... SVG paths ... */}
                    </svg>
                  </button>
                </div>
              </th>
              <th>
                <div className="d-flex flex-row">
                  <input
                    className="form-control m-2"
                    onChange={this.changePhone_NumberFilter}
                    placeholder="Filter"
                  />

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => this.sortResult('Phone_Number', true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-down-square-fill"
                      viewBox="0 0 16 16"
                    >
                      {/* ... SVG paths ... */}
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => this.sortResult('Phone_Number', false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-up-square-fill"
                      viewBox="0 0 16 16"
                    >
                      {/* ... SVG paths ... */}
                    </svg>
                  </button>
                </div>
              </th>
              <th>
                <div className="d-flex flex-row">
                  <input
                    className="form-control m-2"
                    onChange={this.changeIP_AddressFilter}
                    placeholder="Filter"
                  />

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => this.sortResult('IP_Address', true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-down-square-fill"
                      viewBox="0 0 16 16"
                    >
                      {/* ... SVG paths ... */}
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => this.sortResult('IP_Address', false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-up-square-fill"
                      viewBox="0 0 16 16"
                    >
                      {/* ... SVG paths ... */}
                    </svg>
                  </button>
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comps.map((comp) => (
              <tr key={comp.Id}>
                <td>{comp.Full_Name}</td>
                <td>{comp.Phone_Number}</td>
                <td>{comp.IP_Address}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => this.editClick(comp)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => this.deleteClick(comp.Id)}
                  >
                    Delete
                  </button>
                  {/* Add the location button */}
                  <button
                    type="button"
                    className="btn btn-light mr-1"
                    onClick={() => this.fetchLocationByIP()}
                  >
                    Get Location
                  </button>
                  {/* Display the location */}
                  {comp.IP_Address === IP_Address && location && (
                    <span>{location}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {modalTitle}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text">Full Name</span>
                  <input type="text" className="form-control" value={Full_Name} onChange={this.changeFull_Name} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Phone Number</span>
                  <input type="text" className="form-control" value={Phone_Number} onChange={this.changePhone_Number} />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">IP Address</span>
                  <input type="text" className="form-control" value={IP_Address} onChange={this.changeIP_Address} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                {Id === 0 ? (
                  <button type="button" className="btn btn-primary" onClick={() => this.createClick()}>
                    Create
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => this.updateClick()}>
                    Update
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Comp;
