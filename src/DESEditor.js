import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";

class DESEditor extends Component {
  constructor(props) {
    super(props);
  }

  copyToClipboard = () => {
    navigator.clipboard.writeText(this.props.desString);
  };

  render() {
    return (
      <>
        <SyntaxHighlighter language="text" style={darcula}>
          {this.props.desString}
        </SyntaxHighlighter>
        <div>
          <span style={{float:"left"}}>
            <Button variant="dark" onClick={this.copyToClipboard}>
              Copy DES <FontAwesomeIcon size="xs" icon={faCopy} />
            </Button>
          </span>
          <span style={{float:"right"}}>
            <Button variant="danger" onClick={this.props.clearState}>
              Clear Editor <FontAwesomeIcon size="xs" icon={faTrash} />
            </Button>
          </span>
        </div>
      </>
    );
  }
}

DESEditor.propTypes = {
  desString: PropTypes.any,
};

export default DESEditor;
