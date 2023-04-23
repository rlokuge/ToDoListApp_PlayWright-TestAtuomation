/**
 * This collection of tests focuses on negative and destructive test scenarios for [POST]/api/todoItems
 */
import {
  test,
  expect,
  request
} from '@playwright/test';
import {
  apiTestUtils
} from './utils/apiTestUtils';

let apiContext;
let apiTestUtilsObject;
let itemDescription;;

test.beforeAll(async () => {
  apiContext = await request.newContext();
  apiTestUtilsObject = new apiTestUtils(apiContext);
})

test('Post request - Attempt to create a ToDo item with empty string for Description', async () => {
  itemDescription = "";
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseJason = await createItemResponse.json();

  expect(createItemResponse.status()).toBe(400); //Verify the response is as expected
  expect(createItemResponseJason).toBeTruthy(); //Verify that the response is NOT false, 0, '', null, undefined or NaN
  expect(createItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8'); //Verify the content type in the response header 
  expect(createItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy(); //Verify the response - Error title 
  expect(createItemResponseJason.status == 400).toBeTruthy(); //Verify the response - Error code 
  expect(createItemResponseJason.errors.Description.includes("Description field can not be empty")).toBeTruthy(); //Verify the response - Error description  
});

test('Post request - Attempt to create a ToDo item with empty space for Description', async () => {
  itemDescription = " ";
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseJason = await createItemResponse.json();

  expect(createItemResponse.status()).toBe(400);
  expect(createItemResponseJason).toBeTruthy();
  expect(createItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
  expect(createItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
  expect(createItemResponseJason.status == 400).toBeTruthy();
  expect(createItemResponseJason.errors.Description.includes("Description field can not be empty")).toBeTruthy();
});

test('Post request - Attempt to create a ToDo item with null value for Description', async () => {
  itemDescription = null;
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseJason = await createItemResponse.json();

  expect(createItemResponse.status()).toBe(400);
  expect(createItemResponseJason).toBeTruthy();
  expect(createItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
  expect(createItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
  expect(createItemResponseJason.status == 400).toBeTruthy();
  expect(createItemResponseJason.errors.Description.includes("Description field can not be empty")).toBeTruthy();
});

test('Post request - Attempt to create a ToDo item with NUMBER for Description', async () => 
  {
     itemDescription = 123;
     const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
     const createItemResponseJason = await createItemResponse.json();

     expect(createItemResponse.status()).toBe(400);
     expect(createItemResponseJason).toBeTruthy();
     expect(createItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
     expect(createItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
     expect(createItemResponseJason.status == 400).toBeTruthy();
     //expect(createItemResponseJason.errors.Description.includes("The JSON value could not be converted to System.String")).toBeTruthy();
  });

test('Post request - Attempt to create a ToDo item with BOOLEAN value for Description', async () => {
  itemDescription = true;
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseJason = await createItemResponse.json();

  expect(createItemResponse.status()).toBe(400);
  expect(createItemResponseJason).toBeTruthy();
  expect(createItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
  expect(createItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
  expect(createItemResponseJason.status == 400).toBeTruthy();
  //expect(createItemResponseJason.errors.Description.includes("The JSON value could not be converted to System.String")).toBeTruthy();
});

test('Post request - Attempt to create a ToDo item with a string over 255 characters for Description', async () => {
  itemDescription = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseJason = await createItemResponse.json();

  expect(createItemResponse.status()).toBe(400);
  expect(createItemResponseJason).toBeTruthy();
  expect(createItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
  expect(createItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
  expect(createItemResponseJason.status == 400).toBeTruthy();
  expect(createItemResponseJason.errors.Description.includes("Description field can not be greater than 255 characters")).toBeTruthy();
});

test('Post request - Attempt to create a ToDo item with existing description with same case sensitivity', async () => {
  itemDescription = "Test";
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseTwo = await apiTestUtilsObject.createItem(itemDescription);
  expect(createItemResponseTwo.status()).toBe(409);
});

test('Post request - Attempt to create a ToDo item with existing description with changed case sensitivity', async () => {
  itemDescription = "Test";
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseTwo = await apiTestUtilsObject.createItem("tEST");
  expect(createItemResponseTwo.status()).toBe(409);
});

test('Post request - Attempt to create a ToDo item with existing description with with some added spaces in the front', async () => {
  itemDescription = "Test";
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseTwo = await apiTestUtilsObject.createItem("  Test");
  expect(createItemResponseTwo.status()).toBe(409);
});

test('Post request - Attempt to create a ToDo item with existing description with with some added spaces at the end', async () => {
  itemDescription = "Test";
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseTwo = await apiTestUtilsObject.createItem("Test    ");
  expect(createItemResponseTwo.status()).toBe(409);
});