import emailjs from 'emailjs-com';

const templateParams = {
    name: 'James',
    notes: 'Check this out!'
};

emailjs.send('<YOUR SERVICE ID>','<YOUR TEMPLATE ID>', templateParams, '<YOUR USER ID>')
    .then((response) => {
       console.log('SUCCESS!', response.status, response.text);
    }, (err) => {
       console.log('FAILED...', err);
    });
