# Browser Automation Support

This application supports browser automation using Playwright and Selenium for web testing, scraping, and interaction tasks.

## Setup

### Playwright

Playwright is already installed with the application. To use it:

```bash
# Install browsers (if needed)
npx playwright install chromium
```

### Selenium

Selenium is already installed with the application. To use it:

1. Install ChromeDriver for your Chrome version
2. Ensure Chrome is installed on your system

## Usage

### Using Playwright

Playwright provides modern, fast browser automation with:

- Multi-browser support (Chrome, Firefox, Safari)
- Auto-wait for elements
- Network interception
- Screenshot and video recording
- Mobile emulation

**Example Actions:**
- `goto` - Navigate to a URL
- `click` - Click an element by selector
- `fill` - Fill a form field
- `screenshot` - Capture a screenshot
- `text` - Extract text from an element
- `wait` - Wait for an element to appear
- `evaluate` - Execute JavaScript
- `close` - Close the browser session

### Using Selenium

Selenium provides cross-browser automation with:

- Wide browser support
- Large community
- Extensive documentation
- Grid support for parallel testing

**Example Actions:**
- `goto` - Navigate to a URL
- `click` - Click an element by selector
- `fill` - Fill a form field
- `screenshot` - Capture a screenshot
- `text` - Extract text from an element
- `wait` - Wait for an element to appear
- `execute` - Execute JavaScript
- `close` - Close the browser session

## Configuration

### Headless Mode

Both Playwright and Selenium support headless mode (no visible browser). This is enabled by default for faster automation.

To run with visible browser, set `headless: false` in the configuration.

### Retry Logic

Both handlers include automatic retry logic with exponential backoff:
- Default: 3 retries
- Backoff: 1s, 2s, 3s between retries
- Fails gracefully after all retries exhausted

### Timeout Configuration

Default timeouts:
- Page navigation: 30 seconds
- Element interactions: 10 seconds
- Wait for elements: 30 seconds

Customize by passing `timeout` parameter in milliseconds.

## Example Workflows

### Web Scraping

1. Navigate to target URL
2. Wait for elements to load
3. Extract text or data
4. Capture screenshot if needed
5. Close session

### Form Testing

1. Navigate to form URL
2. Fill form fields
3. Click submit button
4. Wait for response
5. Verify success/error message
6. Close session

### Multi-page Navigation

1. Navigate to starting page
2. Click navigation links
3. Wait for page load
4. Extract data from each page
5. Navigate to next page
6. Repeat until complete
7. Close session

## Error Handling

The handlers include comprehensive error handling:

- Connection errors (retry with backoff)
- Element not found (clear error message)
- Timeout errors (configurable timeout)
- Browser crash (automatic restart)
- Invalid selectors (helpful error messages)

## Troubleshooting

### Playwright Not Working

**Issue:** Browser fails to launch

**Solution:**
```bash
npx playwright install chromium
```

### Selenium Not Working

**Issue:** ChromeDriver version mismatch

**Solution:**
1. Check Chrome version: `chrome --version`
2. Download matching ChromeDriver
3. Ensure ChromeDriver is in PATH

### Element Not Found

**Issue:** Selector doesn't match any element

**Solution:**
1. Verify selector is correct
2. Wait for element to load
3. Check if element is in iframe (need to switch context)
4. Use more specific selectors

### Timeout Errors

**Issue:** Action takes longer than timeout

**Solution:**
1. Increase timeout value
2. Check if page is slow to load
3. Verify network connection
4. Check if element is dynamically loaded

## Best Practices

1. **Use specific selectors** - Prefer IDs and classes over generic selectors
2. **Wait for elements** - Don't assume elements are immediately available
3. **Clean up sessions** - Always close browser sessions when done
4. **Handle errors gracefully** - Provide clear error messages
5. **Use headless for CI/CD** - Visible browsers for local debugging only
6. **Take screenshots** - Capture screenshots for debugging failed tests
7. **Test on real browsers** - Don't rely solely on headless mode

## Security Considerations

- Browser automation can access sensitive data
- Use in trusted environments only
- Don't automate login to production systems
- Be aware of rate limiting
- Respect robots.txt and terms of service
