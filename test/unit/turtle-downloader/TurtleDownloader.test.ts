describe('TurtleDownloader', (): void => {
  it.todo('should initialize correctly.');
  it.todo('should close an event if the total data size exceeds the maximum download size.');
  it.todo('should copy the data to the buffer if the total data size is below the maximum.');
  it.todo('should close the request if the statuscode is not in the `2xx successful` range.');
  it.todo('should close the request if the content type is not `text/turtle`.');
  it.todo('should close the request if the `content-length` header is defined to be larger than the maximum size.');
  it.todo('should not close the request if the `content-length` header is not provided.');
  it.todo('should set the maximum download size.');
  it.todo('should reset the downloaded size and the buffer.');
  it.todo('should correctly download the given turtle file.');
});
