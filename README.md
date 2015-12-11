# Start Server

`npm install`

`npm start`


# API Usage

### GET /zombify?input=<plain_text>

Returns the zombified text.

**Resource URL**

http://localhost:7000/zombify?input=<plain_text>

**Example Request**

`http://localhost:7000/zombify?input=drive`

**Example Response**

`{"output":"dRRrrRrvrr"}`

### GET /unzombify?input=<zombie_text>

Returns the plain text.

**Resource URL**

http://localhost:7000/unzombify?input=<zombie_text>

**Example Request**

`http://localhost:7000/unzombify?input=dRRrrRrvrr`

**Example Response**

`{"output":"dreRrve"}`

### Notes

**For both of the above API endpoints, maximum allowed input length is 1000, and below error response is returned accordingly:**

`{"status":414,"message":"Maximum input length allowed is 1000"}`

