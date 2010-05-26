<?php

/**
 *
 * @param <type> $form
 * @param <type> $form_state
 * @return <type>
 */
function WebNAPTR_create($form, &$form_state) {
  drupal_add_js(drupal_get_path('module', 'WebNAPTR') . '/js/WebNAPTR.js');
  drupal_add_js(drupal_get_path('module', 'WebNAPTR') . '/js/WebNAPTR_module.js');

  $form['order'] = array(
    '#type'           => 'textfield',
    '#title'          => t('Order'),
    '#description'    => t('A 16-bit unsigned integer specifying the order in which the NAPTR records will be processed.'),
    '#required'       => TRUE,
  );

  $form['preference'] = array(
    '#type'           => 'textfield',
    '#title'          => t('Preference'),
    '#description'    => t('A 16-bit unsigned integer that specifies the order in which NAPTR records with equal "order" values should be processed.'),
    '#required'       => TRUE,
  );

  $form['flags'] = array(
    '#title' 		=> t('Flags'),
    '#type' 		=> 'fieldset',
  );

  $form['flags']['s'] = array(
    '#type'           => 'radio',
    '#title'          => 'S',
    '#description'    => t('Next lookup should be for SRV records.'),
    '#parents'        => array('flags'),
    '#return_value'   => 's',
  );

  $form['flags']['a'] = array(
    '#type'           => 'radio',
    '#title'          => 'A',
    '#description'    => t('Next lookup should be for either an A, AAAA, or A6 record.'),
    '#parents'        => array('flags'),
    '#return_value'   => 'a',
  );

  $form['flags']['u'] = array(
    '#type'           => 'radio',
    '#title'          => 'U',
    '#description'    => t('The "U" flag means that the next step is not a DNS lookup but that the output of the Regexp field is an URI.'),
    '#parents'        => array('flags'),
    '#return_value'   => 'u',
  );

  $form['flags']['p'] = array(
    '#type'           => 'radio',
    '#title'          => 'P',
    '#description'    => t('Remainder of the application side algorithm shall be carried out in a Protocol-specific fashion.'),
    '#parents'        => array('flags'),
    '#return_value'   => 'p',
  );

  $form['services'] = array(
    '#title' 		=> t('Services'),
    '#type' 		=> 'fieldset',
  );

  $form['services']['e2u_sip'] = array(
    '#type'           => 'radio',
    '#title'          => 'E2U+SIP',
    '#description'    => t('ENUM system for translating telephone number to URI.'),
    '#parents'        => array('services'),
    '#return_value'   => 1,
    '#ajax'           => array(
      'callback'      => 'services_callback',
      'wrapper'       => 'service_settings',
    ),
  );
  $form['service_settings'] = array(
    '#title'          => t('Service settings'),
    '#type'           => 'fieldset',
  );

  if(isset($form_state['values']['services'])) { // && $form['values']['services'] == 1) {
    $form['service_settings']['sip_uri'] = array(
      '#type'           => 'textfield',
      '#title'          => t('SIP URI'),
      '#description'    => t(''),
      '#required'       => TRUE,
    );

    $form['service_settings']['sip_telnum'] = array(
      '#type'           => 'textfield',
      '#title'          => t('Telephone number'),
      '#description'    => t('Write telephone number without +'),
      '#required'       => TRUE,
    );
  }

  $form['result'] = array(
    '#type'             => 'textarea',
    '#title'            => t('Final NAPTR record'),
    '#disabled'         => true,
    '#prefix'           => '<div id="result">',
    '#suffix'           => '</div>',
  );

  $form['submit'] = array(
    '#type'           => 'submit',
    '#value'          => t('Submit'),
    '#prefix'         => '<div id="submit">',
    '#suffix'         => '</div>',
  );

  return $form;
}

function services_callback($form, $form_state) {
  return $form;//['service_settings'];
}