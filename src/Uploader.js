import React, { Component } from 'react'
import { Text } from "react-native"
class Uploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFile: null,
      isSelected: false,
      uploading: false,
      page_data: []
    }
  }


  changeHandler = (event) => {
		this.setState({ 
      selectedFile: event.target.files[0],
      isSelected: true })
	};

	handleSubmission = () => {
    this.setState({ uploading: true })
		var url = ''
    if (this.state.selectedFile.type == 'application/pdf')
      url = 'https://ocr.gallodigital.com/pdf_to_text?jpgs=true'
    else 
      url = 'https://ocr.gallodigital.com/img_to_text'
    
    fetch(
			url,
			{
				method: 'POST',
				body: this.state.selectedFile,
			}
		)
			.then((response) => response.json())
			.then((result) => {
        this.setState({ uploading: false, page_data: result['pages']})
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

  render() {
    const isSelected = this.state.isSelected
    const selectedFile = this.state.selectedFile
    const page_info = this.state.page_data.map((page, i) => {
      return (<tr>
        <td className="w-50">
          <Text>{page['text']}</Text>
        </td>
        <td className="" valign="top">
          <h2>Page { i + 1} of { this.state.page_data.length }</h2>
          <img className="w-100" src={
            "data:image/jpeg;base64, " + (page['image_raw'])} />
        </td>
      </tr>)
    })
    return (
    <div className="bg-light">
      <div className="p-3">
          <div className="card text-center">
            <div className="card-header">
              <h5>Choose a file to OCR</h5>
            </div>
            <div className="card-body">
              {!this.state.uploading && 
                <>
                  <input type="file" name="file" className="btn btn-success" onChange={this.changeHandler} />
                  {isSelected ? (
                    <div className="card offset-4 col-4 bg-light mt-2">
                      <p>Filename: {selectedFile.name}</p>
                      <p>Filetype: {selectedFile.type}</p>
                      <p>Size in bytes: {selectedFile.size}</p>
                      <p>
                        lastModifiedDate:{' '}
                        {selectedFile.lastModifiedDate.toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="p-2">Select a file to show details</p>
                  )}
                  <div>
                    <button className="btn btn-primary m-2" onClick={this.handleSubmission}>Submit for OCR</button>
                  </div>
                </>
              }
              { this.state.uploading && 
                <b>Uploading and scanning...</b>
              }
            </div>  
          </div>
        <div>
          <table>
            {page_info}
          </table>
        </div>
      </div>
    </div>)
  }
}

export default Uploader;
