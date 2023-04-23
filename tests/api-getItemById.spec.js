/**
 * This collection of tests focuses on negative and destructive test scenarios for [GET]/api/todoItems/{id}
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

test('Get request - Retrieve exisitng ToDo item that is marked as completed', async () => {
  itemDescription = await apiTestUtilsObject.createRandomizeDescription();
  const createItemResponse = await apiTestUtilsObject.createItem(itemDescription); //Creates a new item 
  const createItemResponseJason = await createItemResponse.json();
  let itemId = createItemResponseJason;

  const updatePayload = {
     id: itemId,
     description: itemDescription,
     isCompleted: true
  }; //Updates the new item - mark as completed 
  const updateItemResponse = await apiTestUtilsObject.updateItem(itemId, updatePayload);

  const getItemResponse = await apiTestUtilsObject.retrieveItemById(itemId); //Retrieve the item by id 
  const getItemResponseJason = await getItemResponse.json();

  expect(getItemResponse.status()).toBe(200); //Verify the response as expected 
  expect(getItemResponseJason.id.includes(itemId.toString())).toBeTruthy(); //Verify the response - id is as expected
  expect(getItemResponseJason.description.includes(itemDescription)).toBeTruthy(); //Verify the response - desscription is as expected
  expect(getItemResponseJason.isCompleted).toBeTruthy(); //Verify the response - marked as completed 
});

test('Get request - Attempt to retrieve item by non-existing Id', async () => {
  let itemId = "ded77e71-fa67-4c88-bf16-4a6a469b0516";
  const getItemResponse = await apiTestUtilsObject.retrieveItemById(itemId);
  expect(getItemResponse.status()).toBe(404);
});