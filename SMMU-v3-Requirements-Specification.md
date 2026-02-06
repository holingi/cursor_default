# SMMU v3 Requirements Specification

## Document Information

- **Document Title**: System Memory Management Unit (SMMU) v3 Requirements Specification
- **Version**: 1.0
- **Date**: February 6, 2026
- **Status**: Draft

## Table of Contents

1. [Introduction](#1-introduction)
2. [Scope](#2-scope)
3. [Definitions and Acronyms](#3-definitions-and-acronyms)
4. [System Overview](#4-system-overview)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Interface Requirements](#7-interface-requirements)
8. [Security Requirements](#8-security-requirements)
9. [Performance Requirements](#9-performance-requirements)
10. [Compliance Requirements](#10-compliance-requirements)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the requirements for implementing a System Memory Management Unit (SMMU) compliant with the ARM SMMUv3 architecture specification. The SMMU v3 provides memory address translation, protection, and isolation for peripheral devices accessing system memory.

### 1.2 Document Scope

This specification defines the functional and non-functional requirements for SMMU v3 implementation, including translation mechanisms, security features, interrupt handling, fault management, and performance characteristics.

### 1.3 Intended Audience

This document is intended for:
- Hardware architects and designers
- System-on-Chip (SoC) integrators
- Firmware and driver developers
- Verification and validation engineers
- System architects

### 1.4 References

- ARM System Memory Management Unit Architecture Specification (SMMU) v3.x
- ARM Architecture Reference Manual (ARM ARM)
- AMBA AXI and ACE Protocol Specification
- PCIe Base Specification
- ACPI Specification
- Device Tree Specification

---

## 2. Scope

### 2.1 In Scope

- Stage 1 and Stage 2 address translation
- Stream-based device identification and configuration
- Command and event queue interfaces
- Translation table walk mechanisms
- Translation lookaside buffer (TLB) management
- Fault handling and reporting
- Security state management
- Performance monitoring
- Power management interfaces

### 2.2 Out of Scope

- Device-specific driver implementations
- Operating system specific memory management policies
- Physical memory allocation strategies
- System-level cache coherency protocols (beyond SMMU interaction points)

---

## 3. Definitions and Acronyms

| Term | Definition |
|------|------------|
| SMMU | System Memory Management Unit |
| TLB | Translation Lookaside Buffer |
| STE | Stream Table Entry |
| CD | Context Descriptor |
| IPA | Intermediate Physical Address |
| PA | Physical Address |
| VA | Virtual Address |
| StreamID | Stream Identifier - identifier for a device stream |
| SubstreamID | Substream Identifier - identifier within a device stream |
| ASID | Address Space Identifier |
| VMID | Virtual Machine Identifier |
| PRI | Page Request Interface |
| ATS | Address Translation Service |
| MSI | Message Signaled Interrupt |
| HTTU | Hardware Translation Table Update |
| CMDQ | Command Queue |
| EVENTQ | Event Queue |
| PRIQ | Page Request Interface Queue |

---

## 4. System Overview

### 4.1 SMMU v3 Architecture

The SMMU v3 architecture provides a mechanism for devices to access system memory through address translation and protection. It supports:

- Multiple translation stages for virtualization
- Stream-based configuration for flexible device management
- Queue-based command and event interfaces
- Advanced security features including two security states
- Performance optimizations including TLB caching and prefetching

### 4.2 Key Components

1. **Translation Path**: Performs address translation and access permission checks
2. **Configuration Structures**: Stream tables and context descriptors
3. **Queue Interfaces**: Command, event, and page request queues
4. **TLB Structures**: Cache for translation table entries
5. **Control Registers**: Memory-mapped configuration and status registers

---

## 5. Functional Requirements

### 5.1 Address Translation

#### 5.1.1 Stage 1 Translation

**REQ-TRANS-001**: The SMMU SHALL support Stage 1 address translation from Virtual Address (VA) to Intermediate Physical Address (IPA) or Physical Address (PA).

**REQ-TRANS-002**: The SMMU SHALL support the following translation granule sizes:
- 4KB
- 16KB
- 64KB

**REQ-TRANS-003**: The SMMU SHALL support translation table formats compatible with ARMv8-A architecture.

**REQ-TRANS-004**: The SMMU SHALL support address spaces up to 52-bit output addresses.

**REQ-TRANS-005**: The SMMU SHALL support Address Space Identifiers (ASID) for distinguishing between different address spaces.

**REQ-TRANS-006**: The SMMU SHALL implement translation table walk logic compliant with ARMv8-A translation table format.

#### 5.1.2 Stage 2 Translation

**REQ-TRANS-007**: The SMMU SHALL support Stage 2 address translation from IPA to PA for virtualization use cases.

**REQ-TRANS-008**: The SMMU SHALL support Virtual Machine Identifiers (VMID) for isolating different virtual machines.

**REQ-TRANS-009**: The SMMU SHALL support combined Stage 1 + Stage 2 translation.

**REQ-TRANS-010**: The SMMU SHALL support bypass mode where Stage 1, Stage 2, or both stages can be bypassed.

#### 5.1.3 Translation Table Walks

**REQ-TRANS-011**: The SMMU SHALL perform translation table walks by reading translation tables from system memory.

**REQ-TRANS-012**: The SMMU SHALL support coherent translation table walks when configured.

**REQ-TRANS-013**: The SMMU SHALL support configurable translation table walk caching policies.

**REQ-TRANS-014**: The SMMU SHALL respect memory attributes specified in translation table descriptors.

**REQ-TRANS-015**: The SMMU SHALL support Hardware Translation Table Update (HTTU) for Access and Dirty flag management.

### 5.2 Stream Identification and Configuration

#### 5.2.1 Stream Tables

**REQ-STREAM-001**: The SMMU SHALL support Stream Table structures for configuring device streams.

**REQ-STREAM-002**: The SMMU SHALL support linear and 2-level Stream Table formats.

**REQ-STREAM-003**: The SMMU SHALL support StreamID widths configurable from 0 to 32 bits.

**REQ-STREAM-004**: The SMMU SHALL use StreamID from incoming transactions to index the Stream Table.

**REQ-STREAM-005**: Each Stream Table Entry (STE) SHALL contain configuration for:
- Translation stage enables
- Context Descriptor pointer
- Configuration flags
- Bypass/fault/translation mode selection

#### 5.2.2 Context Descriptors

**REQ-STREAM-006**: The SMMU SHALL support Context Descriptor (CD) structures for Stage 1 translation configuration.

**REQ-STREAM-007**: The SMMU SHALL support single-level and 2-level CD table formats.

**REQ-STREAM-008**: The SMMU SHALL support SubstreamID for selecting Context Descriptors within a stream.

**REQ-STREAM-009**: Each Context Descriptor SHALL contain:
- Translation table base address
- Translation table configuration
- ASID
- Memory attribute configuration

### 5.3 Command Queue Interface

**REQ-CMDQ-001**: The SMMU SHALL implement a Command Queue (CMDQ) interface for software control.

**REQ-CMDQ-002**: The SMMU SHALL support the following command types:
- CFGI (Configuration Invalidation)
- TLBI (TLB Invalidation)
- ATC_INV (Address Translation Cache Invalidation)
- PRI_RESP (Page Request Response)
- CMD_SYNC (Synchronization)
- RESUME (Resume stalled transaction)

**REQ-CMDQ-003**: The SMMU SHALL process commands from the CMDQ in order.

**REQ-CMDQ-004**: The SMMU SHALL support command queue sizes from 2 to 64K entries.

**REQ-CMDQ-005**: The SMMU SHALL update the CMDQ consumer index after processing each command.

**REQ-CMDQ-006**: The SMMU SHALL complete CMD_SYNC commands after all preceding commands complete.

**REQ-CMDQ-007**: The SMMU SHALL support multiple command queue instances (if multi-queue support is implemented).

### 5.4 Event Queue Interface

**REQ-EVENTQ-001**: The SMMU SHALL implement an Event Queue (EVENTQ) for reporting events and faults to software.

**REQ-EVENTQ-002**: The SMMU SHALL report the following event types:
- Translation faults (Stage 1 and Stage 2)
- Permission faults
- Access faults
- Configuration errors
- Command errors

**REQ-EVENTQ-003**: Each event record SHALL contain:
- Event type
- StreamID
- SubstreamID (if applicable)
- Faulting address
- Additional event-specific information

**REQ-EVENTQ-004**: The SMMU SHALL support event queue sizes from 2 to 64K entries.

**REQ-EVENTQ-005**: The SMMU SHALL update the EVENTQ producer index after writing each event.

**REQ-EVENTQ-006**: The SMMU SHALL generate an interrupt when configured thresholds are reached.

### 5.5 Translation Lookaside Buffer (TLB)

**REQ-TLB-001**: The SMMU SHALL implement TLB structures for caching translation results.

**REQ-TLB-002**: TLB entries SHALL be tagged with:
- StreamID
- SubstreamID (for Stage 1)
- ASID (for Stage 1)
- VMID (for Stage 2)

**REQ-TLB-003**: The SMMU SHALL invalidate TLB entries in response to TLBI commands.

**REQ-TLB-004**: The SMMU SHALL support the following TLB invalidation scopes:
- Global (all entries)
- By VMID
- By ASID
- By address range
- By StreamID

**REQ-TLB-005**: TLB entries SHALL respect the cacheability and shareability attributes from translation tables.

**REQ-TLB-006**: The SMMU SHALL implement appropriate TLB replacement policies (implementation-defined).

### 5.6 Page Request Interface (PRI)

**REQ-PRI-001**: The SMMU SHALL support Page Request Interface for handling page faults.

**REQ-PRI-002**: The SMMU SHALL implement a Page Request Queue (PRIQ) for queueing page requests.

**REQ-PRI-003**: Page requests SHALL contain:
- Faulting address
- StreamID
- Request type (read/write/execute)
- PASID (Process Address Space ID)

**REQ-PRI-004**: The SMMU SHALL support PRI responses via PRI_RESP commands.

**REQ-PRI-005**: The SMMU SHALL support page request groups for efficient batching.

### 5.7 Address Translation Service (ATS)

**REQ-ATS-001**: The SMMU SHALL support Address Translation Service for devices with integrated translation caches.

**REQ-ATS-002**: The SMMU SHALL respond to ATS translation requests with translated addresses or fault responses.

**REQ-ATS-003**: The SMMU SHALL support ATC invalidation via ATC_INV commands.

**REQ-ATS-004**: The SMMU SHALL track outstanding ATS transactions.

### 5.8 Fault Handling

**REQ-FAULT-001**: The SMMU SHALL detect and report translation faults.

**REQ-FAULT-002**: The SMMU SHALL support the following fault modes:
- Stall mode (stall the transaction and report to software)
- Terminate mode (abort the transaction)

**REQ-FAULT-003**: The SMMU SHALL record fault information in the Event Queue.

**REQ-FAULT-004**: The SMMU SHALL support fault recovery via RESUME commands (for stalled transactions).

**REQ-FAULT-005**: The SMMU SHALL maintain fault state per stream when operating in stall mode.

### 5.9 Memory Attributes and Permissions

**REQ-ATTR-001**: The SMMU SHALL enforce access permissions specified in translation table descriptors:
- Read permission
- Write permission
- Execute permission

**REQ-ATTR-002**: The SMMU SHALL support memory type attributes:
- Device memory
- Normal memory (cacheable, non-cacheable)

**REQ-ATTR-003**: The SMMU SHALL support shareability attributes:
- Non-shareable
- Inner shareable
- Outer shareable

**REQ-ATTR-004**: The SMMU SHALL combine Stage 1 and Stage 2 attributes according to ARM architecture rules.

**REQ-ATTR-005**: The SMMU SHALL support Privileged Execute Never (PXN) and Unprivileged Execute Never (UXN) attributes.

### 5.10 Security Features

**REQ-SEC-001**: The SMMU SHALL support two security states: Secure and Non-secure.

**REQ-SEC-002**: The SMMU SHALL prevent Non-secure streams from accessing Secure memory.

**REQ-SEC-003**: Stream Table Entries SHALL specify the security state of each stream.

**REQ-SEC-004**: The SMMU SHALL support separate Secure and Non-secure programming interfaces where required.

**REQ-SEC-005**: The SMMU SHALL isolate configuration structures between security states.

**REQ-SEC-006**: The SMMU SHALL support security attribute propagation to downstream memory system.

---

## 6. Non-Functional Requirements

### 6.1 Reliability

**REQ-REL-001**: The SMMU SHALL operate continuously without requiring periodic resets under normal operating conditions.

**REQ-REL-002**: The SMMU SHALL detect and report internal parity/ECC errors if implemented.

**REQ-REL-003**: The SMMU SHALL handle malformed commands gracefully by reporting errors without system failure.

**REQ-REL-004**: The SMMU SHALL provide mechanisms to detect and report deadlock conditions.

### 6.2 Maintainability

**REQ-MAINT-001**: The SMMU SHALL provide version identification registers indicating:
- Architecture version
- Implementation version
- Supported features

**REQ-MAINT-002**: The SMMU SHALL implement feature discovery registers for software compatibility.

**REQ-MAINT-003**: The SMMU SHALL provide debug and diagnostic interfaces for system validation.

### 6.3 Scalability

**REQ-SCALE-001**: The SMMU SHALL support configuration of maximum StreamID width at design time.

**REQ-SCALE-002**: The SMMU SHALL support systems with multiple SMMU instances.

**REQ-SCALE-003**: The SMMU architecture SHALL scale from embedded to server-class systems.

---

## 7. Interface Requirements

### 7.1 Device Interface

**REQ-IF-001**: The SMMU SHALL accept transactions from upstream devices via standard bus protocols:
- AXI4
- AXI-Stream
- ACE-Lite
- PCIe (when acting as PCIe SMMU)

**REQ-IF-002**: The SMMU SHALL forward translated transactions to downstream memory system.

**REQ-IF-003**: The SMMU SHALL preserve transaction ordering as required by bus protocol specifications.

**REQ-IF-004**: The SMMU SHALL support transaction IDs for maintaining transaction ordering and completion tracking.

### 7.2 Memory-Mapped Registers

**REQ-REG-001**: The SMMU SHALL implement memory-mapped control and status registers.

**REQ-REG-002**: Register interface SHALL support 32-bit and 64-bit access widths as specified.

**REQ-REG-003**: The SMMU SHALL implement the following register groups:
- Global registers
- Queue base address registers
- Interrupt configuration registers
- Feature and ID registers
- Performance monitoring registers
- Implementation-defined registers

**REQ-REG-004**: Reserved register bits SHALL be read as zero and writes ignored.

**REQ-REG-005**: The SMMU SHALL provide register access permissions (RO, RW, WO) as specified.

### 7.3 Interrupt Interface

**REQ-INT-001**: The SMMU SHALL support interrupt generation for:
- Event queue updates
- PRI queue updates
- Global errors
- Performance monitoring events

**REQ-INT-002**: The SMMU SHALL support both legacy interrupts and MSI/MSI-X.

**REQ-INT-003**: The SMMU SHALL support per-event-type interrupt masking and configuration.

**REQ-INT-004**: The SMMU SHALL provide interrupt status registers for software polling.

### 7.4 Power Management

**REQ-PWR-001**: The SMMU SHALL support clock gating for power reduction when idle.

**REQ-PWR-002**: The SMMU SHALL support power domain isolation where implemented.

**REQ-PWR-003**: The SMMU SHALL provide mechanisms to quiesce operation for power state transitions.

**REQ-PWR-004**: The SMMU SHALL retain configuration state across supported power modes.

### 7.5 Discovery and Configuration

**REQ-DISC-001**: The SMMU SHALL be discoverable via:
- ACPI IORT tables (for ACPI systems)
- Device Tree bindings (for Device Tree systems)
- PCIe configuration space (for PCIe SMMU)

**REQ-DISC-002**: Discovery information SHALL include:
- Base address of register interface
- Interrupt assignments
- Supported features
- Stream ID mapping information

---

## 8. Security Requirements

### 8.1 Isolation

**REQ-SECISO-001**: The SMMU SHALL enforce memory isolation between different StreamIDs.

**REQ-SECISO-002**: The SMMU SHALL enforce isolation between Secure and Non-secure streams.

**REQ-SECISO-003**: The SMMU SHALL prevent unauthorized modification of translation tables via DMA attacks.

**REQ-SECISO-004**: The SMMU SHALL validate all StreamIDs against configured ranges.

### 8.2 Trusted Configuration

**REQ-SECTRUST-001**: Stream Table and Context Descriptor structures SHALL be protected from unauthorized modification.

**REQ-SECTRUST-002**: The SMMU SHALL support Secure-only configuration of security-sensitive streams.

**REQ-SECTRUST-003**: Command Queues SHALL be protected with appropriate access controls.

### 8.3 Side-Channel Protection

**REQ-SECSIDE-001**: The SMMU SHOULD implement protections against timing-based side-channel attacks where feasible.

**REQ-SECSIDE-002**: The SMMU SHALL NOT leak security state information through observable timing variations where possible.

### 8.4 Fault Containment

**REQ-SECFAULT-001**: Translation faults SHALL NOT allow devices to access unauthorized memory.

**REQ-SECFAULT-002**: Configuration errors SHALL NOT result in security state violations.

**REQ-SECFAULT-003**: The SMMU SHALL contain fault effects to the faulting stream without affecting other streams.

---

## 9. Performance Requirements

### 9.1 Translation Latency

**REQ-PERF-001**: The SMMU SHALL minimize translation latency through TLB caching.

**REQ-PERF-002**: TLB hit latency SHALL be minimized (implementation-defined target: < 10 cycles).

**REQ-PERF-003**: The SMMU SHALL support concurrent translation table walks to minimize serialization.

**REQ-PERF-004**: The SMMU SHOULD implement prefetching mechanisms for sequential access patterns.

### 9.2 Throughput

**REQ-PERF-005**: The SMMU SHALL support multiple outstanding transactions to maximize throughput.

**REQ-PERF-006**: The SMMU SHALL minimize pipeline stalls through efficient resource management.

**REQ-PERF-007**: Command queue processing SHALL not significantly impact translation throughput.

### 9.3 Bandwidth

**REQ-PERF-008**: The SMMU SHALL minimize translation table walk bandwidth through efficient caching.

**REQ-PERF-009**: The SMMU SHALL support configurable page walk cache sizes to optimize memory bandwidth.

### 9.4 Performance Monitoring

**REQ-PERF-010**: The SMMU SHALL implement performance monitoring counters for:
- TLB hits/misses
- Translation table walks
- Transaction counts
- Fault counts

**REQ-PERF-011**: Performance counters SHALL be accessible via memory-mapped registers.

**REQ-PERF-012**: The SMMU SHALL support performance counter overflow interrupts.

**REQ-PERF-013**: Performance counters SHALL support filtering by StreamID or other attributes.

---

## 10. Compliance Requirements

### 10.1 Architecture Compliance

**REQ-COMP-001**: The SMMU SHALL comply with ARM SMMU v3 Architecture Specification.

**REQ-COMP-002**: The SMMU SHALL implement all mandatory features defined in the architecture specification.

**REQ-COMP-003**: Optional features, if implemented, SHALL comply with the architecture specification.

**REQ-COMP-004**: The SMMU SHALL correctly identify implemented and non-implemented features via ID registers.

### 10.2 Bus Protocol Compliance

**REQ-COMP-005**: The SMMU SHALL comply with AMBA AXI protocol specification for AXI interfaces.

**REQ-COMP-006**: The SMMU SHALL comply with AMBA ACE protocol specification if cache coherency is supported.

**REQ-COMP-007**: The SMMU SHALL comply with PCIe specification when implementing PCIe SMMU functionality.

### 10.3 Software Interface Compliance

**REQ-COMP-008**: The SMMU SHALL provide software interfaces compatible with standard SMMU v3 drivers.

**REQ-COMP-009**: Register layouts SHALL match the architecture specification.

**REQ-COMP-010**: Data structure formats (STE, CD) SHALL match the architecture specification.

### 10.4 Verification Requirements

**REQ-VERIFY-001**: The SMMU implementation SHALL be verified against ARM SMMU v3 architecture compliance tests.

**REQ-VERIFY-002**: The SMMU SHALL undergo functional verification covering all specified features.

**REQ-VERIFY-003**: The SMMU SHALL undergo stress testing with concurrent multi-stream operations.

**REQ-VERIFY-004**: Security features SHALL be verified through penetration testing and security analysis.

---

## Appendix A: Feature Matrix

| Feature | Support Level | Requirement IDs |
|---------|--------------|-----------------|
| Stage 1 Translation | Mandatory | REQ-TRANS-001 to REQ-TRANS-006 |
| Stage 2 Translation | Mandatory | REQ-TRANS-007 to REQ-TRANS-010 |
| Linear Stream Table | Mandatory | REQ-STREAM-001, REQ-STREAM-002 |
| 2-Level Stream Table | Mandatory | REQ-STREAM-002 |
| Context Descriptors | Mandatory | REQ-STREAM-006 to REQ-STREAM-009 |
| Command Queue | Mandatory | REQ-CMDQ-001 to REQ-CMDQ-006 |
| Event Queue | Mandatory | REQ-EVENTQ-001 to REQ-EVENTQ-006 |
| TLB | Mandatory | REQ-TLB-001 to REQ-TLB-006 |
| Page Request Interface | Optional | REQ-PRI-001 to REQ-PRI-005 |
| Address Translation Service | Optional | REQ-ATS-001 to REQ-ATS-004 |
| HTTU | Optional | REQ-TRANS-015 |
| Security States | Mandatory | REQ-SEC-001 to REQ-SEC-006 |
| MSI Support | Mandatory | REQ-INT-002 |
| Performance Monitoring | Optional | REQ-PERF-010 to REQ-PERF-013 |

---

## Appendix B: Configuration Parameters

| Parameter | Range | Description |
|-----------|-------|-------------|
| StreamID Width | 0-32 bits | Maximum number of distinct streams supported |
| SubstreamID Width | 0-20 bits | Maximum number of substreams per stream |
| Physical Address Width | 32-52 bits | Maximum output address size |
| Virtual Address Width | 32-52 bits | Maximum input address size |
| TLB Entries | Implementation-defined | Number of TLB entries per cache level |
| Command Queue Size | 2-64K entries | Number of command queue entries |
| Event Queue Size | 2-64K entries | Number of event queue entries |
| PRI Queue Size | 2-64K entries | Number of page request queue entries |

---

## Appendix C: Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-02-06 | System Architect | Initial draft |

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| System Architect | | | |
| Hardware Lead | | | |
| Verification Lead | | | |
| Security Lead | | | |
| Project Manager | | | |

---

*End of Document*
