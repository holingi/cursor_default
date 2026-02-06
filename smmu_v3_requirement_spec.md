# SMMU v3 Requirement Specification

Version: 0.1
Date: 2026-02-06
Owner: Platform Architecture

## 1. Purpose
This document defines the functional and non-functional requirements for an
Arm SMMU v3 compliant system memory management unit. The requirements are
intended to guide implementation, verification, and integration.

## 2. Scope
These requirements apply to the SMMU v3 hardware block, its programmer-visible
register interface, firmware configuration, and host driver integration. The
scope includes translation control, stream identification, fault management,
queue management, virtualization support, security, and power management.

## 3. Definitions and Abbreviations
- ATS: Address Translation Service
- CD: Context Descriptor
- CQ: Command Queue
- CMDQ: Command Queue
- EC: Event Queue
- EQ: Event Queue
- GCD: Global Configuration Descriptor
- MSI: Message Signaled Interrupt
- PASID: Process Address Space ID
- PRI: Page Request Interface
- STE: Stream Table Entry
- STRTAB: Stream Table
- S1: Stage 1 translation
- S2: Stage 2 translation
- VMID: Virtual Machine Identifier

## 4. References
- Arm System Memory Management Unit Architecture Specification, SMMU v3
- Arm Arm Architecture Reference Manual for A-profile

## 5. System Context and Assumptions
The SMMU integrates between bus masters (PCIe, DMA engines, accelerators) and
system memory. Software configures the SMMU via MMIO registers to provide
translation, protection, and isolation for DMA transactions.

## 6. Requirements

### 6.1 Architecture Compliance
- SMMU-REQ-001: The SMMU shall implement the Arm SMMU v3 architecture.
- SMMU-REQ-002: The SMMU shall expose the mandatory global and per-queue
  registers required by the SMMU v3 specification.
- SMMU-REQ-003: The SMMU shall support 64-bit physical addressing for internal
  tables and queues.
- SMMU-REQ-004: The SMMU shall report implemented features via the ID
  registers as defined by the architecture.
- SMMU-REQ-005: The SMMU shall be endian-safe as required by the architecture
  and document supported endianness for configuration access.

### 6.2 Translation Support
- SMMU-REQ-010: The SMMU shall support Stage 1 translation for DMA requests.
- SMMU-REQ-011: The SMMU shall support Stage 2 translation for DMA requests.
- SMMU-REQ-012: The SMMU shall support combined Stage 1 and Stage 2 translation.
- SMMU-REQ-013: The SMMU shall support bypass and faulting modes per stream.
- SMMU-REQ-014: The SMMU shall support address size up to 48 bits for input
  virtual addresses and 48 bits for output physical addresses.
- SMMU-REQ-015: The SMMU shall support at least 4 KB translation granule size.
- SMMU-REQ-016: If 16 KB or 64 KB granules are supported, the SMMU shall
  advertise support in the ID registers and operate correctly for those sizes.
- SMMU-REQ-017: The SMMU shall support translation table walk per the Arm
  A-profile translation format.
- SMMU-REQ-018: The SMMU shall support shareability and cacheability attributes
  for translation table walks.
- SMMU-REQ-019: The SMMU shall enforce memory access permissions defined by
  page table entries.
- SMMU-REQ-020: The SMMU shall support a minimum of 256 Stream IDs.
- SMMU-REQ-021: The SMMU shall support a minimum of 16-bit Stream IDs when
  configured for large stream tables.

### 6.3 Stream Table and Context Descriptors
- SMMU-REQ-030: The SMMU shall implement a Stream Table (STRTAB) for Stream ID
  to STE translation.
- SMMU-REQ-031: The SMMU shall support both linear and two-level stream tables
  when indicated by feature registers.
- SMMU-REQ-032: The SMMU shall implement Stream Table Entry (STE) fields for
  translation type, security, and cacheability controls.
- SMMU-REQ-033: The SMMU shall support per-stream configuration of translation
  stage and bypass behavior.
- SMMU-REQ-034: The SMMU shall support Substream IDs where indicated by
  PASID/SSSID capability.
- SMMU-REQ-035: The SMMU shall implement Context Descriptors (CD) for Stage 1
  translation.
- SMMU-REQ-036: The SMMU shall support at least 256 Context Descriptors.
- SMMU-REQ-037: The SMMU shall validate CD fields and generate faults on
  invalid configurations.

### 6.4 Queue Management
- SMMU-REQ-040: The SMMU shall implement a Command Queue (CMDQ) for software
  control commands.
- SMMU-REQ-041: The SMMU shall implement an Event Queue (EVTQ) for fault and
  event reporting.
- SMMU-REQ-042: The SMMU shall implement a PRI Queue when PRI is supported.
- SMMU-REQ-043: The CMDQ, EVTQ, and PRI Queue shall support power-of-two sizes
  within the limits reported by the SMMU ID registers.
- SMMU-REQ-044: The SMMU shall support queue invalidation commands for TLB and
  cache maintenance.
- SMMU-REQ-045: The SMMU shall provide completion and error status for CMDQ
  entries as required by the specification.
- SMMU-REQ-046: The SMMU shall preserve queue state across interrupts and
  support software-driven recovery after errors.

### 6.5 Fault Handling and Reporting
- SMMU-REQ-050: The SMMU shall detect translation faults, access permission
  faults, and configuration faults.
- SMMU-REQ-051: The SMMU shall report faults via the Event Queue with the
  required fault syndrome information.
- SMMU-REQ-052: The SMMU shall generate MSI or wired interrupts for queue
  events as configured by software.
- SMMU-REQ-053: The SMMU shall support fault suppression and replay controls
  when ATS or PRI are enabled.
- SMMU-REQ-054: The SMMU shall support per-stream fault reporting and
  identification of the offending Stream ID and Substream ID.

### 6.6 ATS and PRI
- SMMU-REQ-060: If ATS is supported, the SMMU shall implement translation
  caching and invalidation semantics compatible with ATS.
- SMMU-REQ-061: If PRI is supported, the SMMU shall generate page requests for
  missing mappings and handle responses from software.
- SMMU-REQ-062: If PASID is supported, the SMMU shall associate PASID with
  Context Descriptors for Stage 1 translation.
- SMMU-REQ-063: The SMMU shall report ATS, PRI, and PASID capabilities in the
  appropriate ID registers.

### 6.7 Virtualization and Isolation
- SMMU-REQ-070: The SMMU shall support VMID tagging for Stage 2 translations.
- SMMU-REQ-071: The SMMU shall support per-VMID translation tables and
  isolation between VMs.
- SMMU-REQ-072: The SMMU shall allow secure and non-secure stream isolation
  per the STE security attributes.
- SMMU-REQ-073: The SMMU shall prevent cross-domain access between streams
  configured to different translation contexts.
- SMMU-REQ-074: The SMMU shall support multiple S1 contexts for a given Stream
  ID when PASID is enabled.

### 6.8 Performance and Scalability
- SMMU-REQ-080: The SMMU shall provide a translation cache (TLB) for frequently
  accessed mappings.
- SMMU-REQ-081: The SMMU shall support invalidation of cached translations at
  stream, context, and global granularity.
- SMMU-REQ-082: The SMMU shall sustain a minimum of one translation per cycle
  for burst DMA traffic, excluding page table walk latency.
- SMMU-REQ-083: The SMMU shall support at least 8 outstanding translation
  requests per stream.

### 6.9 Power, Reset, and Reliability
- SMMU-REQ-090: The SMMU shall support a hardware reset that returns the block
  to a defined safe state.
- SMMU-REQ-091: The SMMU shall block DMA transactions until configured after
  reset.
- SMMU-REQ-092: The SMMU shall retain or restore configuration across
  low-power states as defined by platform firmware.
- SMMU-REQ-093: The SMMU shall detect internal errors and report them via the
  Event Queue and error status registers.

### 6.10 Programmer's Model
- SMMU-REQ-100: The SMMU shall expose MMIO registers at a 4 KB aligned base
  address.
- SMMU-REQ-101: The SMMU shall support register accesses of 32-bit and 64-bit
  widths as defined by the architecture.
- SMMU-REQ-102: The SMMU shall implement secure access control to configuration
  registers where required.
- SMMU-REQ-103: The SMMU shall support MSI-based interrupts for queue events.
- SMMU-REQ-104: The SMMU shall support interrupt aggregation if implemented
  and report the capability.

### 6.11 Software and Firmware Integration
- SMMU-REQ-110: The SMMU shall be discoverable by firmware using standard
  platform description mechanisms (e.g., ACPI or device tree).
- SMMU-REQ-111: The SMMU shall allow firmware to lock configuration of secure
  streams before handing control to the OS.
- SMMU-REQ-112: The SMMU shall support OS driver initialization without
  requiring privileged firmware assistance beyond base discovery.
- SMMU-REQ-113: The SMMU shall provide a mechanism for driver-detected feature
  probing via ID registers.

### 6.12 Verification and Compliance
- SMMU-REQ-120: The implementation shall pass a compliance test suite aligned
  to the Arm SMMU v3 architecture requirements.
- SMMU-REQ-121: The implementation shall include directed tests for CMDQ,
  EVTQ, and PRI queue boundary conditions.
- SMMU-REQ-122: The implementation shall include tests for fault injection and
  error reporting paths.
- SMMU-REQ-123: The implementation shall include performance characterization
  for translation hit and miss latency.

## 7. Open Items
- Confirm required translation granule sizes beyond 4 KB.
- Confirm minimum Stream ID width for the target platform.
- Confirm ATS and PRI support requirements for target devices.
