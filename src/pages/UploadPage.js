import React, { Component } from "react";
import styled, { css } from "styled-components";
import Dropzone from "react-dropzone";
import {
  Col,
  Form,
  Button,
  FormGroup,
  Label,
  Input,
  ListGroupItem,
  ListGroup
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";

import * as api from "../api";
import BaseLayout from "../layouts/BaseLayout";

export default class UploadPage extends Component {
  state = {
    uploaded: null,
    attributes: [],
    datetimeAttributes: "",
    latitudeAttribute: "",
    longitudeAttribute: "",
    title: "",
    redirectTo: ""
  };

  handleChange = key => event => {
    const { value } = event.target;
    this.setState(() => ({
      [key]: value
    }));
  };

  handleAttributeToggle = index => () => {
    this.setState(({ attributes }) => ({
      attributes: attributes.map(
        (a, i) => (i === index ? { ...a, isVisible: !a.isVisible } : a)
      )
    }));
  };

  handleDrop = accepted => {
    const [uploaded] = accepted;

    if (!!uploaded) {
      const reader = new FileReader();

      reader.onload = () => {
        const contents = reader.result.trim();
        const attributes = contents
          .substr(0, contents.indexOf("\n"))
          .split(",")
          .map(h => h.trim().replace(/(^"|"$)/g, ""));

        const title = uploaded.name
          .split(".")
          .slice(0, -1)
          .join(" ")
          .split(/[-_]/)
          .join(" ")
          .replace(/\s+/, " ")
          .trim();

        const {
          lat: latitudeAttribute,
          lng: longitudeAttribute
        } = getLatLngAttributes(attributes);
        const datetimeAttributes = getDatetimeAttributes(attributes);

        this.setState(() => ({
          uploaded,
          title,
          attributes: attributes.map(a => ({ value: a, isVisible: true })),
          datetimeAttributes: datetimeAttributes.join(","),
          latitudeAttribute: latitudeAttribute || "",
          longitudeAttribute: longitudeAttribute || ""
        }));
      };

      reader.readAsText(uploaded);
    } else {
      this.setState(() => ({
        uploaded
      }));
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const {
      uploaded,
      attributes,
      datetimeAttributes,
      title,
      latitudeAttribute,
      longitudeAttribute
    } = this.state;

    if (!uploaded) {
      return;
    }

    if (title === "") {
      return;
    }

    if (latitudeAttribute === "" || longitudeAttribute === "") {
      return;
    }

    api
      .createDataset({
        title,
        latitudeAttribute,
        longitudeAttribute,
        datetimeAttributes:
          datetimeAttributes.trim() === ""
            ? []
            : datetimeAttributes.split(",").map(a => a.trim()),
        visibleAttributes: attributes.filter(a => a.isVisible).map(a => a.value)
      })
      .then(({ data }) => {
        api.uploadDataset(data.id, uploaded).then(() => {
          this.setState(() => ({
            redirectTo: data.id
          }));
        });
      });
  };

  componentWillUnmount() {
    const { uploaded } = this.state;
    if (uploaded) {
      window.URL.revokeObjectURL(uploaded.preview);
    }
  }

  render() {
    const {
      uploaded,
      attributes,
      datetimeAttributes,
      title,
      latitudeAttribute,
      longitudeAttribute,
      redirectTo
    } = this.state;

    if (!!redirectTo) {
      return <Redirect to={`/environment/${redirectTo}`} />;
    }

    return (
      <div>
        <BaseLayout title="Upload a dataset">
          <h2>Upload a dataset</h2>

          {!!uploaded ? (
            <Col md={4}>
              <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label>Dataset</Label>
                  <Input value={uploaded.name} readOnly={true} />
                </FormGroup>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={this.handleChange("title")}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Latitude attribute</Label>
                  <Input
                    type="select"
                    value={latitudeAttribute}
                    onChange={this.handleChange("latitudeAttribute")}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {attributes.map(({ value }, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Longitude attribute</Label>
                  <Input
                    type="select"
                    value={longitudeAttribute}
                    onChange={this.handleChange("longitudeAttribute")}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {attributes.map(({ value }, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Datetime attributes</Label>
                  <Input
                    placeholder="Datetime attributes"
                    value={datetimeAttributes}
                    onChange={this.handleChange("datetimeAttributes")}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Visible attributes</Label>
                  <ListGroup>
                    {attributes.map((attribute, index) => (
                      <ListGroupItem key={index}>
                        {attribute.value}
                        <Button
                          color={attribute.isVisible ? "primary" : "secondary"}
                          onClick={this.handleAttributeToggle(index)}
                          size="sm"
                          className="float-right"
                        >
                          <i
                            className={`fas fa-${
                              attribute.isVisible ? "eye" : "eye-slash"
                            }`}
                          />
                        </Button>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </FormGroup>

                <Button tag={Link} to="/">
                  Cancel
                </Button>
                <Button color="success" className="float-right">
                  Upload
                </Button>
              </Form>
            </Col>
          ) : (
            <Dropzone
              style={getDropzoneStyle()}
              accept=".csv"
              onDrop={this.handleDrop}
            >
              {({ isDragActive }) => (
                <Uploader active={isDragActive}>
                  <Uploader.Icon className="fas fa-upload" />
                  <p>{isDragActive ? "Drop to upload" : "Click to upload"}</p>
                </Uploader>
              )}
            </Dropzone>
          )}
        </BaseLayout>
      </div>
    );
  }
}

const getDropzoneStyle = () => {
  return { width: "100%", height: "30rem" };
};

const Uploader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${props =>
    props.active &&
    css`
      background: #f5f5f5;
    `};
`;

Uploader.Icon = styled.i`
  margin: 1rem;
  font-size: 10rem;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;

const getLatLngAttributes = attributes => {
  return {
    lat: attributes.find(a => /(latitude|lat$)/gi.test(a)),
    lng: attributes.find(a => /(longitude|lng$)/gi.test(a))
  };
};

const getDatetimeAttributes = attributes => {
  return attributes.filter(a => /(.*at|time|timestamp)$/gi.test(a));
};
