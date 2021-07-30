<?php

/**
 * Description
 * To arive the data from client and send to email
 *
 * Set-Up
 * Beginning + Middle + End
 * 0 spaces + 80 spaces + 0 spaces = 80 character line limit
 */

class SendMail
{

	private $data;
	private $file;
	private $boundary;
	private $subject = 'You have a new message, fromm Planet Embroidery Web Page';
	private $envio = false;

	function __construct() {
		$this->envio = false;
		$this->boundary = "==Multipart_Boundary_x" . md5(time()) . "x";
		$this->extract_data();
		$this->extract_file();
		$this->generate_buffer_file();
		$this->tosend($this->create_message(), $this->create_header());
		$this->send_feedback();
    }

	private function extract_data() {
		$this->data = array(
			"name" => isset($_POST['name']) ? $_POST['name'] : '',
			"email" => isset($_POST['email']) ? $_POST['email'] : '',
			"interest" => isset($_POST['intere']) ? $_POST['intere'] : '',
			"kind" => isset($_POST['kind']) ? $_POST['kind'] : '',
			"note" => isset($_POST['Notes']) ? $_POST['Notes'] : ''
		);
	}

	private function extract_file() {
		if ($_FILES['archivo']['name'])
			$this->file = array(
				"name" => $_FILES['archivo']['name'],
				"size" => $_FILES['archivo']['size'],
				"type" => $_FILES['archivo']['type'],
				"src" => $_FILES["archivo"]["tmp_name"]
			);
		else
		$this->file = false;
	}

	private function generate_buffer_file() {
		if ($this->file != false)
		{
			$resource = fopen($this->file["src"], "rb");
			$file_readed = fread($resource, $this->file["size"]);
			$this->file["buffer"] = chunk_split(base64_encode($file_readed));
		}
	}

	private function create_header() {
		$headers = "MINE-VERSION: 1.0\r\n";
		$headers .= "Content-type: multipart/mixed;";
		$headers .= "boundary=\"=C=T=E=C=\"\r\n";
		$headers .= 'From: ' . $this->data["name"] . "\r\n";
		$headers .= 'Email: ' . $this->data["email"] . "\r\n";
		return $headers;
	}

    private function create_message() {

		$message = "";

		if ($this->file != false)
		{
			$message .= "--{$this->boundary}\n" . "Content-Type: text/plain; charset=\"iso-8859-1\"\n";
			$message .= "Content-Transfer-Encoding: 7bit\n\n" . $this->data["note"] . "\n\n";
			$message .= "--{$this->boundary}\n";

		//Cuerpo con el archivo adjunto.
			$message .= "--=C=T=E=C=\r\n";
			$message .= "Content-Type: application/octet-stream; ";
			$message .= "name=" . $this->file["name"] . "\r\n";
			$message .= "Content-Transfer-Encoding: base64\r\n";
			$message .= "Content-Disposition: attachment; ";
			$message .= "filename=" . $this->file["name"] . "\r\n";
			$message .= "\r\n"; // línea vacía

			$file = $this->file["buffer"];

			$message .= "$file\r\n";
			$message .= "\r\n"; // línea vacía
			$message .= "--=C=T=E=C=\r\n";
		}
		$message .= "{$this->data["note"]}\n";
		return $message;
	}

    private function tosend($message,  $headers)
	{
		$this->envio = mail('planetemby@gmail.com', $this->subject,  $message,  $headers);
	}

	private function send_feedback()
	{
		if ($this->envio)
			echo '<h4>Your message has been sent. Soon, we will contact you.</h4>';
		else
			echo '<h4>The message has not been sent. Try again.</h4>';
	}
}

// EOF
