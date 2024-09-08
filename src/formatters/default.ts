import { Formatter } from "../types/formatters.js"
import { normalizeDate } from "../utils/index.js"

export const defaultFormatter:Formatter = (data, suffix) => {
  const createdDate = data?.creation_date ?? null
  const updatedDate = data?.updated_date ?? null
  const expiresDate = (data?.registry_expiry_date || data?.registrar_registration_expiration_date) ?? null

  const createdDateNormalized = normalizeDate(createdDate)
  const updatedDateNormalized = normalizeDate(updatedDate)
  const expiresDateNormalized = normalizeDate(expiresDate)

  return {
    createdDate,
    updatedDate,
    expiresDate,
    registrant: {
      organization: data?.registrant_organization ?? null,
      state: data?.['registrant_state/province'] ?? null,
      countryCode: data?.registrant_country ?? null,
      email: data?.registrant_email ?? null,
    },
    administrativeContact: {
      organization: data?.admin_organization ?? null,
      state: data?.['admin_state/province'] ?? null,
      countryCode: data?.admin_country ?? null,
      email: data?.admin_email ?? null,
    },
    technicalContact: {
      organization: data?.tech_organization ?? null,
      state: data?.['tech_state/province'] ?? null,
      countryCode: data?.tech_country ?? null,
      email: data?.tech_email ?? null,
    },
    domainName: data?.domain_name ?? null,
    domainId: data?.registry_domain_id ?? null,
    nameServers: data?.name_server ?? null,
    status: data?.domain_status ?? null,
    createdDateNormalized,
    updatedDateNormalized,
    expiresDateNormalized,
    registryData: {
      createdDate,
      updatedDate,
      expiresDate,
      domainName: data?.domain_name ?? null,
      nameServers: data?.name_server ?? null,
      status: data?.domain_status ?? null,
      registrarName: data?.registrar ?? null,
      registrarIANAID: data?.registrar_iana_id ?? null,
      createdDateNormalized,
      updatedDateNormalized,
      expiresDateNormalized,
      whoisServer: data?.registrar_whois_server ?? null,
      registrarUrl: data?.registrar_url ?? null,
    },
    contactEmail: data?.registrar_abuse_contact_email ?? null,
    contactPhone: data?.registrar_abuse_contact_phone ?? null,
    domainNameExt: suffix,
    dnssec: data?.dnssec ?? null,
    whoisInaccuracyContact: (data?.url_of_the_icann_whois_inaccuracy_complaint_form || data?.url_of_the_icann_whois_data_problem_reporting_system) ?? null,
    rawText: data?.raw_text ?? null,
  }
}