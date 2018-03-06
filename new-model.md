# Changes of the New Data model


## Problem

Bibliographic Resource has now 157 type-dependent properties.

## Solution

Create class that resolves the type dependent properties by prefixing property
names. `TypedResource`

## Further Necessary Changes

## Interface

In `locbd.service.ts`, cast all returned Bibliographic Resources to
`TypedResource`.

### Short Resource Format

- Assert that the new short resource format still works with `TypedResource`.
- Conditionally make use of the additional properties, given by certain type. See whether Anne's mapping can be reused.


### Dynamic Forms

- Assert that `TypedResource` properly interacts with the forms.
- Adapt Form View, such that Type selector is the most important one.
- Keep in mind, that different types need different properties to be accessed.
- What if the type is changed but there are values, preferably copy/move them?
- **Only own Properties should be editable, else we run into inconsistencies,**
  other properties may be displayed but with `disabled` attribute.

### Data Ingestion

Both saveElectronicJournal and saveScan need to call `saveResource` in
`locdb.service.ts`.
