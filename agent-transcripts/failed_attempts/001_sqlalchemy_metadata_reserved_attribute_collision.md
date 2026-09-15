# Failed Attempt 001: SQLAlchemy Reserved Attribute `metadata` Collision

## Context
During initial database model definition, JSON fields for storing session and message metadata were declared as:
```python
class SessionModel(Base):
    __tablename__ = "sessions"
    metadata_ = Column("metadata", JSON, default=dict)
```

## Problem / Error Encountered
During API response serialization and pytest execution, FastAPI threw `ResponseValidationError`:
```text
fastapi.exceptions.ResponseValidationError: 2 validation errors:
  {'type': 'dict_type', 'loc': ('response', 'metadata'), 'msg': 'Input should be a valid dictionary', 'input': MetaData()}
  {'type': 'get_attribute_error', 'loc': ('response', 'messages'), 'msg': "Error extracting attribute: MissingGreenlet..."}
```

## Diagnosis
1. In SQLAlchemy's `declarative_base()`, `Base.metadata` is a reserved class property pointing to the internal `MetaData()` registry of table schemas.
2. When Pydantic v2 attempted `from_attributes=True` extraction on the `metadata` field, SQLAlchemy resolved the class attribute `MetaData()` instead of the column value, causing validation failure.
3. Unloaded relationships on `messages` also caused `MissingGreenlet` in async execution.

## Correction
1. Renamed database columns to explicit domain names: `session_metadata`, `message_metadata`, `chunk_metadata`, `artifact_metadata`.
2. Updated Pydantic schemas to map directly to `session_metadata`.
3. Added `lazy="selectin"` on SQLAlchemy relationships so child records are eagerly and asynchronously retrieved without blocking IO.

## Result
Tests in `test_sessions.py` and `test_api.py` passed with 100% reliability.
