# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-04-17 17:31
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Lawyer', '0008_remove_lawyer_fields'),
        ('Client', '0002_client_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='Saved',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Client.Client')),
                ('lawyer', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='Lawyer.Lawyer')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='saved',
            unique_together=set([('lawyer', 'client')]),
        ),
    ]