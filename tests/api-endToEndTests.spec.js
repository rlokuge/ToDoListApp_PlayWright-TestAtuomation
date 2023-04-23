/**
 * This collection of tests focuses on end-to-end happy path for the TodoList.Api
 */
import {
  test,
  expect,
  request
} from '@playwright/test';
import {
  apiTestUtils
} from './utils/apiTestUtils';

test.describe.configure({
  mode: 'serial'
});
let itemId;
let apiContext;
let apiTestUtilsObject;
let itemDescription;;

test.beforeAll(async () => {
  apiContext = await request.newContext();
  apiTestUtilsObject = new apiTestUtils(apiContext);
})

test('Post request - Create ToDo Item', async () => {
  itemDescription = await apiTestUtilsObject.createRandomizeDescription();
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription);
  const createItemResponseJason = await createItemResponse.json();

  expect(createItemResponse.status()).toBe(201); //Verify the response as expected 
  expect(await createItemResponseJason).toBeTruthy(); //Verify that the response is NOT false, 0, '', null, undefined or NaN
  expect(await createItemResponse.headers()['content-type']).toContain('application/json; charset=utf-8'); //Verify the expected content type in the response header 
  itemId = createItemResponseJason;
});

test('Get request - Retrieve exisitng ToDo item', async () => {
  const getItemResponse = await apiTestUtilsObject.retrieveItemById(itemId);
  const getItemResponseJason = await getItemResponse.json();

  expect(getItemResponse.status()).toBe(200);
  expect(getItemResponse.headers()['content-type']).toContain('application/json; charset=utf-8');
  expect(getItemResponseJason.id.includes(itemId.toString())).toBeTruthy(); //Verify the response - id is as expected
  expect(getItemResponseJason.description.includes(itemDescription)).toBeTruthy(); //Verify the response - desscription is as expected
  expect(getItemResponseJason.isCompleted).toBeFalsy(); //Verify the response - marked as not completed 
});

test('Get request - Retrieve all the items and verify that the newly created item is returned', async () => {
  const getItemListResponse = await apiTestUtilsObject.retrieveAllItems();
  let itemObject = await apiTestUtilsObject.findItemFromList(getItemListResponse, itemId);

  expect(await getItemListResponse.status()).toBe(200);
  expect(await getItemListResponse.headers()['content-type']).toContain('application/json; charset=utf-8');
  expect(itemObject.itemId.includes(itemId)).toBeTruthy();
  expect(itemObject.itemDescription.includes(itemDescription)).toBeTruthy();
  expect(itemObject.itemisCompleted).toBeFalsy();
});

test('Update request - Update existing ToDo item', async () => {
  let updatedDescription = itemDescription + "1"; //Update the item with new description 
  const updatePayload = {
     id: itemId,
     description: updatedDescription,
     isCompleted: false
  };
  const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);
  expect(updateItemResponse.status()).toBe(204);

  const getItemResponse = await apiTestUtilsObject.retrieveItemById(itemId); //Retrieve updated item to verify that the item's description is updated
  const getItemResponseJason = await getItemResponse.json();
  expect(getItemResponse.status()).toBe(200);
  expect(getItemResponseJason.id.includes(itemId.toString())).toBeTruthy();
  expect(getItemResponseJason.description.includes(updatedDescription)).toBeTruthy();
  expect(getItemResponseJason.isCompleted).toBeFalsy();
});