/**
 * Options for sending an email via RedBase email worker.
 */
export interface EmailSendOptions {
  /** Recipient email address(es). */
  to: string | string[]
  /** Email subject line. */
  subject: string
  /** HTML body content. */
  html: string
  /** Plain text body content (optional fallback). */
  text?: string
  /** Reply-to address (optional). */
  replyTo?: string
  /** CC recipients (optional). */
  cc?: string | string[]
  /** BCC recipients (optional). */
  bcc?: string | string[]
}

/**
 * Response from the email send endpoint.
 */
export interface EmailSendResponse {
  /** Whether the email was queued successfully. */
  success: boolean
  /** Message ID if successful. */
  messageId?: string
  /** Error message if failed. */
  error?: string
}

/**
 * Email client for sending transactional emails via RedBase.
 *
 * **Important:** Use with `SERVICE_ROLE_KEY` on the server only.
 * The email endpoint requires elevated privileges and should never
 * be called from client-side code with the anon key.
 */
export interface EmailClient {
  /**
   * Send a transactional email.
   *
   * @param options - Email options (to, subject, html, text, etc.)
   * @returns Promise resolving to the send result
   *
   * @example
   * ```ts
   * const { success, messageId, error } = await rb.email.send({
   *   to: 'user@example.com',
   *   subject: 'Welcome!',
   *   html: '<h1>Hello</h1>',
   *   text: 'Hello',
   * })
   * ```
   */
  send(options: EmailSendOptions): Promise<EmailSendResponse>
}
