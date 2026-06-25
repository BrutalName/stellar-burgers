import { test, expect, Page } from '@playwright/test';

test.describe('Список ингредиентов с HAR', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });
    await page.goto('/');
  });

  test('Должен загрузить HAR-файл ингредиентов', async ({ page }) => {
    await expect(
      page.getByTestId('ingredient-643d69a5c3f7b9001cfa093c')
    ).toBeVisible();
  });

  test('Должен добавить ингредиенты', async ({ page }) => {
    await page
      .getByTestId('ingredient-643d69a5c3f7b9001cfa093c')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByTestId('ingredient-643d69a5c3f7b9001cfa093e')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByTestId('ingredient-643d69a5c3f7b9001cfa0949')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.getByTestId('burger-top')).toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('burger-ingredient')).toContainText(
      'Филе Люминесцентного тетраодонтимформа'
    );
    await expect(page.getByTestId('burger-ingredient')).toContainText(
      'Мини-салат Экзо-Плантаго'
    );
    await expect(page.getByTestId('burger-bottom')).toContainText(
      'Краторная булка N-200i'
    );

    await expect(page.getByTestId('burger-top')).not.toContainText(
      'Мини-салат Экзо-Плантаго'
    );
    await expect(page.getByTestId('burger-top')).not.toContainText(
      'Филе Люминесцентного тетраодонтимформа'
    );
    await expect(page.getByTestId('burger-ingredient')).not.toContainText(
      'Краторная булка N-200i'
    );
    await expect(page.getByTestId('burger-bottom')).not.toContainText(
      'Мини-салат Экзо-Плантаго'
    );
    await expect(page.getByTestId('burger-bottom')).not.toContainText(
      'Филе Люминесцентного тетраодонтимформа'
    );
  });

  test.describe('Проверка модальных окон ингредиентов', () => {
    const openingModal = async (page: Page) => {
      await page
        .getByTestId('ingredient-643d69a5c3f7b9001cfa093c')
        .getByRole('link')
        .click();
    };

    test('Открывает модальное окно ингредиента', async ({ page }) => {
      await openingModal(page);

      await expect(page.getByTestId('modal')).toBeVisible();
      await expect(page.getByTestId('modal')).toContainText(
        'Краторная булка N-200i'
      );
    });

    test('Закрывает модальное окно ингредиента по клику на кнопку', async ({
      page
    }) => {
      await openingModal(page);

      await page.getByTestId('modal').getByRole('button').click();

      await expect(page.getByTestId('modal')).not.toBeVisible();
    });

    test('Закрывает модальное окно ингредиента по клику на оверплей', async ({
      page
    }) => {
      await openingModal(page);

      await expect(page.getByTestId('modal')).toBeVisible();

      await page
        .getByTestId('modal-overlay')
        .click({ position: { x: 12, y: 12 } });

      await expect(page.getByTestId('modal')).not.toBeVisible();
    });
  });
});

test('Создание заказа', async ({ context, page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'token');
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/user',
    update: false
  });

  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/ingredients',
    update: false
  });

  await page.routeFromHAR('./tests/hars/order.har', {
    url: '**/orders',
    update: false,
    updateMode: 'full'
  });

  await page.goto('/');

  await page
    .getByTestId('ingredient-643d69a5c3f7b9001cfa093c')
    .getByRole('button', { name: 'Добавить' })
    .click();

  await page
    .getByTestId('ingredient-643d69a5c3f7b9001cfa093e')
    .getByRole('button', { name: 'Добавить' })
    .click();

  await page
    .getByTestId('ingredient-643d69a5c3f7b9001cfa0949')
    .getByRole('button', { name: 'Добавить' })
    .click();

  await page.getByTestId('button-order').click();

  await expect(page.getByTestId('modal')).toBeVisible();

  await expect(page.getByTestId('order-number')).toContainText('107107');

  await page.getByTestId('modal').getByRole('button').click();

  await expect(page.getByTestId('modal')).not.toBeVisible();

  await expect(page.getByTestId('burger-top')).not.toContainText(
    'Краторная булка N-200i'
  );
  await expect(page.getByTestId('burger-ingredient')).not.toContainText(
    'Мини-салат Экзо-Плантаго'
  );
  await expect(page.getByTestId('burger-ingredient')).not.toContainText(
    'Филе Люминесцентного тетраодонтимформа'
  );
  await expect(page.getByTestId('burger-bottom')).not.toContainText(
    'Краторная булка N-200i'
  );

  await page.evaluate(() => {
    localStorage.clear();
  });

  await context.clearCookies();
});
