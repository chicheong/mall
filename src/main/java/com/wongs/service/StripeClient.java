package com.wongs.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.Stripe;
import com.stripe.model.Charge;
import com.wongs.service.dto.MyOrderDTO;

/**
 * Service Implementation for managing Stripe.
 */
@Service
@Transactional
public class StripeClient {

    private final Logger log = LoggerFactory.getLogger(StripeClient.class);
    private final SimpleDateFormat FULL_FORMAT = new SimpleDateFormat("yyyyMMddHHmmssSSS");
    
    public StripeClient() {
    	Stripe.apiKey = "sk_test_6wGWsGOGRJtR2h12xeVBXGdW";
    }

    public Charge chargeCard(MyOrderDTO myOrder, String login) throws Exception {
        Map<String, Object> chargeParams = new HashMap<String, Object>();
        chargeParams.put("amount", myOrder.getTotal().multiply(new BigDecimal(100)).intValue());
        chargeParams.put("currency", myOrder.getCurrency());
        chargeParams.put("source", myOrder.getPayment().getToken());
        chargeParams.put("description", "Charge " + login + " @" + FULL_FORMAT.format(new Date()));
        Charge charge = Charge.create(chargeParams);
        return charge;
    }
}
