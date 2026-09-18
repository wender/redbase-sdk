import type { EmailClient, EmailSendOptions, EmailSendResponse } from './types'

/**
 * Creates an email client for sending transactional emails via RedBase.
 *
 * @internal
 * @param redbaseUrl - The RedBase API URL
 * @param apiKey - The API key (should be SERVICE_ROLE_KEY for email)
 */
export function createEmailClient(
  redbaseUrl: string,
  apiKey: string
): EmailClient {
  const baseUrl = redbaseUrl.replace(/\/$/, '')

  return {
    async send(options: EmailSendOptions): Promise<EmailSendResponse> {
      const url = `${baseUrl}/email/v1/send`

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            apikey: apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: Array.isArray(options.to) ? options.to : [options.to],
            subject: options.subject,
            html: options.html,
            text: options.text,
            reply_to: options.replyTo,
            cc: options.cc
              ? Array.isArray(options.cc)
                ? options.cc
                : [options.cc]
              : undefined,
            bcc: options.bcc
              ? Array.isArray(options.bcc)
                ? options.bcc
                : [options.bcc]
              : undefined,
          }),
        })

        if (!response.ok) {
          const errorBody = await response.text()
          let errorMessage: string

          try {
            const parsed = JSON.parse(errorBody)
            errorMessage = parsed.error || parsed.message || errorBody
          } catch {
            errorMessage = errorBody || `HTTP ${response.status}`
          }

          return {
            success: false,
            error: errorMessage,
          }
        }

        const data = await response.json()

        return {
          success: true,
          messageId: data.message_id || data.messageId,
        }
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Unknown error sending email',
        }
      }
    },
  }
}
