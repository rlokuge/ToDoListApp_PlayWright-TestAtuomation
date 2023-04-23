/**
 * This collection of tests focuses on negative and destructive test scenarios for [PUT]/api/todoItems/{id}
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
 let itemDescription;
 let itemId;
 
 test.beforeAll(async () => {
    apiContext = await request.newContext();
    apiTestUtilsObject = new apiTestUtils(apiContext);
 
    itemDescription = await apiTestUtilsObject.createRandomizeDescription();
    const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
    const createItemResponseJason = await createItemResponse.json();
    itemId = createItemResponseJason;
 });
 
 test('Put request - Update an item with only required parameters', async () => {
    let updatedDescription = itemDescription + "1";
    const updatePayload = {
       id: itemId,
       description: updatedDescription
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const getItemResponse = await apiTestUtilsObject.retrieveItemById(itemId);
    const getItemResponseJason = await getItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(204); //Verify the response as expected 
    expect(getItemResponseJason.id.includes(itemId.toString())).toBeTruthy(); //Verify the response - id is as expected
    expect(getItemResponseJason.description.includes(updatedDescription)).toBeTruthy(); //Verify the response - desscription is as expected
    expect(getItemResponseJason.isCompleted).toBeFalsy(); //Verify the response - marked as not completed 
 });
 
 test('Put request - Update an item with required and optional parameters', async () => {
    let updatedDescription = itemDescription + "1";
    const updatePayload = {
       id: itemId,
       description: updatedDescription,
       isCompleted: true
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const getItemResponse = await apiTestUtilsObject.retrieveItemById(itemId);
    const getItemResponseJason = await getItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(204);
    expect(getItemResponseJason.id.includes(itemId.toString())).toBeTruthy();
    expect(getItemResponseJason.description.includes(updatedDescription)).toBeTruthy();
    expect(getItemResponseJason.isCompleted).toBeTruthy();
 });
 
 test('Put request - Update an item with required and optional parameters - without real updates', async () => {
    const updatePayload = {
       id: itemId,
       description: itemDescription,
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const getItemResponse = await apiTestUtilsObject.retrieveItemById(itemId);
    const getItemResponseJason = await getItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(204);
    expect(getItemResponseJason.id.includes(itemId.toString())).toBeTruthy();
    expect(getItemResponseJason.description.includes(itemDescription)).toBeTruthy();
    expect(getItemResponseJason.isCompleted).toBeFalsy();
 });
 
 test('Put request - Update an item with an empty string for Id in the request body', async () => {
    const updatePayload = {
       id: "",
       description: itemDescription,
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8'); //Verify the content type in the response header 
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy(); //Verify the response - Error title 
    expect(updateItemResponseJason.status == 400).toBeTruthy(); //Verify the response - Error code
 });
 
 test('Put request - Update an item with invalid id in the URL and request body', async () => {
    const updatePayload = {
       id: "755f75f0-3dee-4603-b143-2e47590249b3",
       description: itemDescription,
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem("755f75f0-3dee-4603-b143-2e47590249b3", updatePayload);
    expect(updateItemResponse.status()).toBe(404);
 });
 
 test('Put request - Update an item with different Ids in body and url', async () => {
    let itemIdBody;
    if (itemId.charAt(itemId - 1) == "1") {
       itemIdBody = itemId.slice(0, -1) + "0";
    } else {
       itemIdBody = itemId.slice(0, -1) + "1";
    }
    const updatePayload = {
       id: itemIdBody,
       description: itemDescription,
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    expect(updateItemResponse.status()).toBe(400);
 });
 
 test('Put request - Update an item with empty description', async () => {
    const updatePayload = {
       id: itemId,
       description: "",
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
    expect(updateItemResponseJason.status == 400).toBeTruthy();
    expect(updateItemResponseJason.errors.Description.includes("Description field can not be empty")).toBeTruthy();
 });
 
 test('Put request - Update an item with empty space for the description', async () => {
    const updatePayload = {
       id: itemId,
       description: " ",
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
    expect(updateItemResponseJason.status == 400).toBeTruthy();
    expect(updateItemResponseJason.errors.Description.includes("Description field can not be empty")).toBeTruthy();
 });
 
 test('Put request - Update an item with null value for the description', async () => {
    const updatePayload = {
       id: itemId,
       description: null,
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
    expect(updateItemResponseJason.status == 400).toBeTruthy();
    expect(updateItemResponseJason.errors.Description.includes("Description field can not be empty")).toBeTruthy();
 });
 
 test('Put request - Update an item with over 255 character string for the description', async () => {
    let longDescription = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    const updatePayload = {
       id: itemId,
       description: longDescription,
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
    expect(updateItemResponseJason.status == 400).toBeTruthy();
    expect(updateItemResponseJason.errors.Description.includes("Description field can not be greater than 255 characters")).toBeTruthy();
 });
 
 test('Put request - Update an item with NUMBER for the description', async () => {
    const updatePayload = {
       id: itemId,
       description: 123,
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
    expect(updateItemResponseJason.status == 400).toBeTruthy();
    //expect(updateItemResponseJason.errors.Description.includes("The JSON value could not be converted to System.String.")).toBeTruthy();
 });
 
 test('Put request - Update an item with BOOLEAN value for the description', async () => {
    const updatePayload = {
       id: itemId,
       description: true,
       isCompleted: false
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
    expect(updateItemResponseJason.status == 400).toBeTruthy();
    //expect(updateItemResponseJason.errors.Description.includes("The JSON value could not be converted to System.String.")).toBeTruthy();
 });
 
 test('Put request - Update an item with exactly same description from another item', async () => {
    let newItemDescription = await apiTestUtilsObject.createRandomizeDescription();
    const createItemResponse = await apiTestUtilsObject.createItem(newItemDescription); //Create a new item with unique description 
 
    const updatePayload = {
       id: itemId,
       description: itemDescription,
       isCompleted: false
    }; //Update the new item with previously used description 
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    expect(updateItemResponse.status()).toBe(409);
 });
 
 test('Put request - Update an item with string value for isCompleted', async () => {
    const updatePayload = {
       id: itemId,
       description: true,
       isCompleted: "abc"
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
    expect(updateItemResponseJason.status == 400).toBeTruthy();
    //expect(updateItemResponseJason.errors.Description.includes("The JSON value could not be converted to System.String.")).toBeTruthy();
 });
 
 test('Put request - Update an item with NUMBER for isCompleted', async () => {
    const updatePayload = {
       id: itemId,
       description: true,
       isCompleted: 123
    };
    const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
    const updateItemResponseJason = await updateItemResponse.json();
 
    expect(updateItemResponse.status()).toBe(400);
    expect(updateItemResponseJason).toBeTruthy();
    expect(updateItemResponse.headers()['content-type']).toContain('application/problem+json; charset=utf-8');
    expect(updateItemResponseJason.title.includes("One or more validation errors occurred.")).toBeTruthy();
    expect(updateItemResponseJason.status == 400).toBeTruthy();
    //expect(updateItemResponseJason.errors.Description.includes("The JSON value could not be converted to System.String.")).toBeTruthy();
 });