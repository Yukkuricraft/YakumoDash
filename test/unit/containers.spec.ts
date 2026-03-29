import { describe, it, expect } from 'vitest'

import {
  ContainerType,
  AuxContainerTypes,
  getContainerType,
  getContainerNameLabel,
  getFormattedContainerName,
} from '../../app/composables/containers'

describe('getContainerType', () => {
  it.each([
    ['minecraft', ContainerType.Minecraft],
    ['backup', ContainerType.Backup],
    ['mysql', ContainerType.MySQL],
    ['postgres', ContainerType.Postgres],
    ['velocity', ContainerType.MCProxy],
    ['redis', ContainerType.Redis],
  ])('returns %s type for label value "%s"', (value, expected) => {
    expect(getContainerType({ 'net.yukkuricraft.container_type': value })).toBe(expected)
  })

  it('returns Unknown for an unrecognised type string', () => {
    expect(getContainerType({ 'net.yukkuricraft.container_type': 'something-else' })).toBe(ContainerType.Unknown)
  })

  it('returns Unknown when the label is absent', () => {
    expect(getContainerType({})).toBe(ContainerType.Unknown)
  })
})

describe('AuxContainerTypes', () => {
  it('does not include Minecraft or Backup', () => {
    expect(AuxContainerTypes).not.toContain(ContainerType.Minecraft)
    expect(AuxContainerTypes).not.toContain(ContainerType.Backup)
  })

  it('includes all infrastructure container types', () => {
    expect(AuxContainerTypes).toContain(ContainerType.MCProxy)
    expect(AuxContainerTypes).toContain(ContainerType.MySQL)
    expect(AuxContainerTypes).toContain(ContainerType.Postgres)
    expect(AuxContainerTypes).toContain(ContainerType.Redis)
  })
})

describe('getContainerNameLabel', () => {
  it('returns the container_name label value', () => {
    expect(getContainerNameLabel({ 'net.yukkuricraft.container_name': 'mc1' })).toBe('mc1')
  })

  it('returns "UnknownContainer" when the label is absent', () => {
    expect(getContainerNameLabel({})).toBe('UnknownContainer')
  })
})

describe('getFormattedContainerName', () => {
  it('capitalises the first character of the container name', () => {
    expect(getFormattedContainerName({ 'net.yukkuricraft.container_name': 'velocity' })).toBe('Velocity')
    expect(getFormattedContainerName({ 'net.yukkuricraft.container_name': 'myServer' })).toBe('MyServer')
  })

  it('leaves an already-capitalised name unchanged', () => {
    expect(getFormattedContainerName({ 'net.yukkuricraft.container_name': 'Redis' })).toBe('Redis')
  })

  it('falls back to "UnknownContainer" when the label is absent', () => {
    expect(getFormattedContainerName({})).toBe('UnknownContainer')
  })
})
