# Failed Attempt 002: Pytest-Asyncio Fixture Resolution & Strict Mode

## Context
Running `pytest` on async FastAPI endpoints with `pytest-asyncio` version 0.26+ generated fixture warnings and errors when async client fixtures were invoked.

## Problem / Error Encountered
```text
AttributeError: 'async_generator' object has no attribute 'get'
PytestRemovedIn9Warning: '' requested an async fixture 'setup_test_database' with autouse=True...
```

## Diagnosis
1. Pytest 8 and pytest-asyncio 0.26+ enforce strict mode by default. Standard `@pytest.fixture` on an async generator is treated as a coroutine rather than unwrapping the `AsyncClient` yield value.
2. In strict mode, pytest expects `@pytest_asyncio.fixture` or `asyncio_mode = auto` configured in `pytest.ini`.

## Correction
1. Created `pytest.ini` with:
   ```ini
   [pytest]
   asyncio_mode = auto
   asyncio_default_fixture_loop_scope = session
   ```
2. Switched test fixtures in `conftest.py` to `@pytest_asyncio.fixture`.

## Result
Async fixtures properly inject the initialized `AsyncClient`, allowing clean HTTP calls across the entire test suite.
